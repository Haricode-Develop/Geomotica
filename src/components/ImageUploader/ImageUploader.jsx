import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, Typography, IconButton, LinearProgress } from '@mui/material';
import { CloudUpload, Cancel } from '@mui/icons-material';
import axios from 'axios';
import { CompanyContext } from '../../context/CompanyContext';
import { API_BASE_URL } from '../../utils/config';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const ImageUploader = ({ userId }) => {
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { setLogo } = useContext(CompanyContext);  // Usar el contexto para actualizar el logo

    // Cargar el logo existente si existe
    useEffect(() => {
        const fetchExistingLogo = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}configuration/logoEmpresa/${userId}`, {
                    responseType: 'blob'
                });

                if (response.data.size > 0) {
                    const logoUrl = URL.createObjectURL(response.data);
                    setPreviewUrl(logoUrl);
                }
            } catch (error) {
                console.error('No se encontró un logo existente:', error);
            }
        };

        fetchExistingLogo();
    }, [userId]);

    const validateAndSetImage = (file) => {
        if (file) {
            if (file.size > MAX_IMAGE_SIZE) {
                setError('La imagen excede el tamaño máximo de 2MB.');
                return;
            }

            if (!ALLOWED_TYPES.includes(file.type)) {
                setError('Formato de imagen no soportado. Solo se permiten JPEG, PNG y GIF.');
                return;
            }

            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        validateAndSetImage(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        validateAndSetImage(file);
    };

    const handleUpload = async () => {
        if (!image) return;

        const formData = new FormData();
        formData.append('logoFile', image);
        formData.append('userId', userId);

        setUploading(true);
        setUploadProgress(0);

        try {
            const response = await axios.post(`${API_BASE_URL}configuration/logoEmpresa`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            if (response.status === 200) {
                const newLogoUrl = URL.createObjectURL(image);
                setLogo(newLogoUrl);  // Actualiza el logo en el contexto
                setPreviewUrl(newLogoUrl);  // Actualiza la vista previa
                setError('');  // Limpiar cualquier error anterior
            }
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            setError('Error al subir la imagen. Inténtalo nuevamente.');
        } finally {
            setUploading(false);
        }
    };

    const handleCancelUpload = () => {
        setImage(null);
        setPreviewUrl(null);
        setUploadProgress(0);
        setUploading(false);
    };

    return (
        <Box
            sx={{
                border: '2px dashed #aaa',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                '&:hover': {
                    backgroundColor: '#e9e9e9',
                },
            }}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            <input
                accept="image/*"
                type="file"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="upload-button"
            />
            <label htmlFor="upload-button" style={{ cursor: 'pointer' }}>
                {!previewUrl && (
                    <Box>
                        <CloudUpload style={{ fontSize: 50, color: '#aaa' }} />
                        <Typography variant="h6" color="textSecondary">
                            Arrastra la imagen aquí o
                        </Typography>
                        <Button variant="contained" color="primary" component="span">
                            Seleccionar Imagen
                        </Button>
                        <Typography variant="body2" color="textSecondary">
                            Tamaño máximo: 2MB
                        </Typography>
                    </Box>
                )}
                {previewUrl && (
                    <Box>
                        <img
                            src={previewUrl}
                            alt="Vista previa"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '150px',
                                marginBottom: '10px',
                                borderRadius: '8px',
                            }}
                        />
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Button variant="contained" color="primary" onClick={handleUpload} disabled={uploading}>
                                {uploading ? 'Subiendo...' : 'Subir Imagen'}
                            </Button>
                            <IconButton color="secondary" onClick={handleCancelUpload} disabled={uploading}>
                                <Cancel />
                            </IconButton>
                        </Box>
                        {uploading && (
                            <Box mt={2}>
                                <LinearProgress variant="determinate" value={uploadProgress} />
                                <Typography variant="body2" color="textSecondary">
                                    {uploadProgress}%
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </label>
            {error && (
                <Typography variant="body2" color="error" mt={2}>
                    {error}
                </Typography>
            )}
        </Box>
    );
};

export default ImageUploader;
