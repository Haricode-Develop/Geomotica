import { queue } from 'd3-queue';
import L from 'leaflet';

const cacheBusterDate = +new Date();

export function leafletImage2(map, callback) {
    const hasMapbox = !!L.mapbox;
    const dimensions = map.getSize();
    const layerQueue = queue(1);

    const canvas = document.createElement('canvas');
    canvas.width = dimensions.x;
    canvas.height = dimensions.y;
    const ctx = canvas.getContext('2d');

    const dummycanvas = document.createElement('canvas');
    dummycanvas.width = 1;
    dummycanvas.height = 1;
    const dummyctx = dummycanvas.getContext('2d');
    dummyctx.fillStyle = 'rgba(0,0,0,0)';
    dummyctx.fillRect(0, 1, 1, 1);

    map.eachLayer(drawTileLayer);
    map.eachLayer(drawEsriDynamicLayer);

    if (map._pathRoot) {
        layerQueue.defer(handlePathRoot, map._pathRoot);
    } else if (map._panes) {
        const firstCanvas = map._panes.overlayPane.getElementsByTagName('canvas').item(0);
        if (firstCanvas) { layerQueue.defer(handlePathRoot, firstCanvas); }
    }

    map.eachLayer(drawMarkerLayer);
    map.eachLayer(drawPolygonLayer);
    map.eachLayer(drawPolylineLayer);
    map.eachLayer(drawCircleMarkerLayer);
    map.eachLayer(drawImageOverlay); // Modificación para manejar imageOverlay

    layerQueue.awaitAll(layersDone);

    function drawTileLayer(l) {
        if (l instanceof L.TileLayer) layerQueue.defer(handleTileLayer, l);
        else if (l._heat) layerQueue.defer(handlePathRoot, l._canvas);
    }

    function drawMarkerLayer(l) {
        if (l instanceof L.Marker && l.options.icon instanceof L.Icon) {
            layerQueue.defer(handleMarkerLayer, l);
        }
    }

    function drawEsriDynamicLayer(l) {
        if (!L.esri) return;
        if (l instanceof L.esri.DynamicMapLayer) {
            layerQueue.defer(handleEsriDymamicLayer, l);
        }
    }

    function drawPolygonLayer(l) {
        if (l instanceof L.Polygon) {
            layerQueue.defer(handlePolygonLayer, l);
        }
    }

    function drawPolylineLayer(l) {
        if (l instanceof L.Polyline) {
            layerQueue.defer(handlePolylineLayer, l);
        }
    }

    function drawCircleMarkerLayer(l) {
        if (l instanceof L.CircleMarker) {
            layerQueue.defer(handleCircleMarkerLayer, l);
        }
    }

    // Nueva función para manejar imageOverlay
    function drawImageOverlay(l) {
        if (l instanceof L.ImageOverlay) {
            layerQueue.defer(handleImageOverlayLayer, l);
        }
    }

    function done() {
        callback(null, canvas);
    }

    function handleTileLayer(layer, callback) {
        const isCanvasLayer = (L.TileLayer.Canvas && layer instanceof L.TileLayer.Canvas);
        const canvas = document.createElement('canvas');

        canvas.width = dimensions.x;
        canvas.height = dimensions.y;

        const ctx = canvas.getContext('2d');
        const bounds = map.getPixelBounds();
        const zoom = map.getZoom();
        const tileSize = layer.options.tileSize;

        if (zoom > layer.options.maxZoom || zoom < layer.options.minZoom ||
            (hasMapbox && layer instanceof L.mapbox.tileLayer && !layer.options.tiles)) {
            return callback();
        }

        const tileBounds = L.bounds(
            bounds.min.divideBy(tileSize)._floor(),
            bounds.max.divideBy(tileSize)._floor()
        );
        const tiles = [];
        const tileQueue = queue(1);

        for (let j = tileBounds.min.y; j <= tileBounds.max.y; j++) {
            for (let i = tileBounds.min.x; i <= tileBounds.max.x; i++) {
                tiles.push(new L.Point(i, j));
            }
        }

        tiles.forEach(function (tilePoint) {
            const originalTilePoint = tilePoint.clone();

            if (layer._adjustTilePoint) {
                layer._adjustTilePoint(tilePoint);
            }

            const tilePos = originalTilePoint
                .scaleBy(new L.Point(tileSize, tileSize))
                .subtract(bounds.min);

            if (tilePoint.y >= 0) {
                if (isCanvasLayer) {
                    const tile = layer._tiles[tilePoint.x + ':' + tilePoint.y];
                    tileQueue.defer(canvasTile, tile, tilePos, tileSize);
                } else {
                    const url = addCacheString(layer.getTileUrl(tilePoint));
                    tileQueue.defer(loadTile, url, tilePos, tileSize);
                }
            }
        });

        tileQueue.awaitAll(tileQueueFinish);

        function canvasTile(tile, tilePos, tileSize, callback) {
            callback(null, {
                img: tile,
                pos: tilePos,
                size: tileSize
            });
        }

        function loadTile(url, tilePos, tileSize, callback) {
            const im = new Image();
            im.crossOrigin = '';
            im.onload = function () {
                callback(null, {
                    img: this,
                    pos: tilePos,
                    size: tileSize
                });
            };
            im.onerror = function (e) {
                if (layer.options.errorTileUrl !== '' && e.target.errorCheck === undefined) {
                    e.target.errorCheck = true;
                    e.target.src = layer.options.errorTileUrl;
                } else {
                    callback(null, {
                        img: dummycanvas,
                        pos: tilePos,
                        size: tileSize
                    });
                }
            };
            im.src = url;
        }

        function tileQueueFinish(err, data) {
            data.forEach(drawTile);
            callback(null, { canvas: canvas });
        }

        function drawTile(d) {
            ctx.drawImage(d.img, Math.floor(d.pos.x), Math.floor(d.pos.y),
                d.size, d.size);
        }
    }

    function handlePathRoot(root, callback) {
        const bounds = map.getPixelBounds();
        const origin = map.getPixelOrigin();
        const canvas = document.createElement('canvas');
        canvas.width = dimensions.x;
        canvas.height = dimensions.y;
        const ctx = canvas.getContext('2d');
        const pos = L.DomUtil.getPosition(root).subtract(bounds.min).add(origin);
        try {
            ctx.drawImage(root, pos.x, pos.y, canvas.width - (pos.x * 2), canvas.height - (pos.y * 2));
            callback(null, { canvas: canvas });
        } catch (e) {
            console.error('Element could not be drawn on canvas', root);
        }
    }

    function handleMarkerLayer(marker, callback) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const pixelBounds = map.getPixelBounds();
        const minPoint = new L.Point(pixelBounds.min.x, pixelBounds.min.y);
        const pixelPoint = map.project(marker.getLatLng());
        const isBase64 = /^data\:/.test(marker._icon.src);
        const url = isBase64 ? marker._icon.src : addCacheString(marker._icon.src);
        const im = new Image();
        const options = marker.options.icon.options;
        const size = options.iconSize;
        const pos = pixelPoint.subtract(minPoint);
        const anchor = L.point(options.iconAnchor || size && size.divideBy(2, true));

        if (size instanceof L.Point) size = [size.x, size.y];

        const x = Math.round(pos.x - size[0] + anchor.x);
        const y = Math.round(pos.y - anchor.y);

        canvas.width = dimensions.x;
        canvas.height = dimensions.y;
        im.crossOrigin = '';

        im.onload = function () {
            ctx.drawImage(this, x, y, size[0], size[1]);
            callback(null, { canvas: canvas });
        };

        im.src = url;

        if (isBase64) im.onload();
    }

    function handlePolygonLayer(layer, callback) {
        const bounds = map.getBounds();
        const latLngs = layer.getLatLngs();

        if (!latLngs || latLngs.length === 0) {
            return callback(null, { canvas: null });
        }

        const flatLatLngs = latLngs.flat(Infinity).filter(latlng => bounds.contains(latlng));

        if (flatLatLngs.length === 0) {
            return callback(null, { canvas: null });
        }

        const polygonCanvas = document.createElement('canvas');
        polygonCanvas.width = canvas.width;
        polygonCanvas.height = canvas.height;
        const polygonCtx = polygonCanvas.getContext('2d');

        const fillColor = layer.options.fillColor || 'rgba(245,214,48,0.5)';
        const strokeColor = layer.options.color || 'rgba(0, 0, 0, 1)';
        const lineWidth = layer.options.weight || 2;

        polygonCtx.fillStyle = fillColor;
        polygonCtx.strokeStyle = strokeColor;
        polygonCtx.lineWidth = lineWidth;

        requestAnimationFrame(() => {
            polygonCtx.beginPath();
            flatLatLngs.forEach((latlng, index) => {
                const point = map.latLngToContainerPoint(latlng);
                if (index === 0) {
                    polygonCtx.moveTo(point.x, point.y);
                } else {
                    polygonCtx.lineTo(point.x, point.y);
                }
            });
            polygonCtx.closePath();
            polygonCtx.fill();
            polygonCtx.stroke();
            callback(null, { canvas: polygonCanvas });
        });
    }

    function handlePolylineLayer(layer, callback) {
        const bounds = map.getBounds();
        const latLngs = layer.getLatLngs();

        if (!latLngs || latLngs.length === 0) {
            return callback(null, { canvas: null });
        }

        const flatLatLngs = latLngs.flat(Infinity).filter(latlng => bounds.contains(latlng));

        if (flatLatLngs.length === 0) {
            return callback(null, { canvas: null });
        }

        const polylineCanvas = document.createElement('canvas');
        polylineCanvas.width = canvas.width;
        polylineCanvas.height = canvas.height;
        const polylineCtx = polylineCanvas.getContext('2d');

        const strokeColor = layer.options.color || 'rgba(0, 0, 0, 1)';
        const lineWidth = layer.options.weight || 2;

        polylineCtx.strokeStyle = strokeColor;
        polylineCtx.lineWidth = lineWidth;

        requestAnimationFrame(() => {
            polylineCtx.beginPath();
            flatLatLngs.forEach((latlng, index) => {
                const point = map.latLngToContainerPoint(latlng);
                if (index === 0) {
                    polylineCtx.moveTo(point.x, point.y);
                } else {
                    polylineCtx.lineTo(point.x, point.y);
                }
            });
            polylineCtx.stroke();
            callback(null, { canvas: polylineCanvas });
        });
    }

    // Nueva función para manejar la renderización de ImageOverlay en canvas
    function handleImageOverlayLayer(layer, callback) {
        const bounds = map.getBounds();
        const overlayBounds = layer.getBounds();

        if (!overlayBounds || !bounds.intersects(overlayBounds)) {
            return callback(null, { canvas: null });
        }

        const overlayCanvas = document.createElement('canvas');
        overlayCanvas.width = canvas.width;
        overlayCanvas.height = canvas.height;
        const overlayCtx = overlayCanvas.getContext('2d');

        const imageUrl = layer._url;
        const im = new Image();
        im.crossOrigin = '';

        im.onload = function () {
            const topLeft = map.latLngToContainerPoint(overlayBounds.getNorthWest());
            const bottomRight = map.latLngToContainerPoint(overlayBounds.getSouthEast());
            const width = bottomRight.x - topLeft.x;
            const height = bottomRight.y - topLeft.y;

            overlayCtx.drawImage(im, topLeft.x, topLeft.y, width, height);
            callback(null, { canvas: overlayCanvas });
        };

        im.src = imageUrl;
    }

    function layersDone(err, layers) {
        if (err) {
            return callback(err);
        }

        const visibleLayers = layers.filter(layer => layer.canvas);
        const drawPromises = visibleLayers.map((layer) => {
            return new Promise((resolve) => {
                const layerCanvas = normalizeCanvas(layer.canvas, canvas.width, canvas.height);
                if (layerCanvas) {
                    requestAnimationFrame(() => {
                        ctx.drawImage(layerCanvas, 0, 0);
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        });

        Promise.all(drawPromises).then(() => {
            callback(null, canvas);
        });
    }

    function normalizeCanvas(layerCanvas, targetWidth, targetHeight) {
        if (!layerCanvas) {
            return createBlankCanvas(targetWidth, targetHeight);
        }
        return layerCanvas;
    }

    function createBlankCanvas(width, height) {
        if (typeof OffscreenCanvas !== 'undefined') {
            const blankCanvas = new OffscreenCanvas(width, height);
            const blankCtx = blankCanvas.getContext('2d');
            blankCtx.fillStyle = 'rgba(0, 0, 0, 0)';
            blankCtx.fillRect(0, 0, width, height);
            return blankCanvas;
        } else {
            const blankCanvas = document.createElement('canvas');
            blankCanvas.width = width;
            blankCanvas.height = height;
            const blankCtx = blankCanvas.getContext('2d');
            blankCtx.fillStyle = 'rgba(0, 0, 0, 0)';
            blankCtx.fillRect(0, 0, width, height);
            return blankCanvas;
        }
    }

    function handleCircleMarkerLayer(marker, callback) {
        const canvas = document.createElement('canvas');
        canvas.width = dimensions.x;
        canvas.height = dimensions.y;
        const ctx = canvas.getContext('2d');
        console.log("ESTE ES EL MARKER: ", marker);
        const pixelPoint = map.project(marker.getLatLng());
        const size = marker.options.radius * 2 || 4;

        ctx.beginPath();
        ctx.arc(pixelPoint.x, pixelPoint.y, marker.options.radius || 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = marker.options.fillColor || 'rgba(0, 0, 0, 0.5)';
        ctx.fill();
        ctx.strokeStyle = marker.options.color || '#000';
        ctx.lineWidth = marker.options.weight || 0.2;
        ctx.stroke();

        callback(null, { canvas });
    }


    function handleEsriDymamicLayer(dynamicLayer, callback) {
        const canvas = document.createElement('canvas');
        canvas.width = dimensions.x;
        canvas.height = dimensions.y;

        const ctx = canvas.getContext('2d');

        const im = new Image();
        im.crossOrigin = '';
        im.src = addCacheString(dynamicLayer._currentImage._image.src);

        im.onload = function () {
            ctx.drawImage(im, 0, 0);
            callback(null, { canvas: canvas });
        };
    }

    function addCacheString(url) {
        if (isDataURL(url) || url.indexOf('mapbox.com/styles/v1') !== -1) {
            return url;
        }
        return url + ((url.match(/\?/)) ? '&' : '?') + 'cache=' + cacheBusterDate;
    }

    function isDataURL(url) {
        const dataURLRegex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
        return !!url.match(dataURLRegex);
    }
}