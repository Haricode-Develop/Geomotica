import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Papa from "papaparse";
import "./DashboardStyle.css";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Sidebar from "../../components/LayoutSide";
import profilePicture from "./img/user.png";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import MapComponent from "../MapeoGenerador/mapeo";
import DataCard from "../../components/CardData/cardData";
import L from "leaflet";
// Componente del Mapa

function Dashboard() {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  console.log(userData)
  for (var clave in userData) {
    if (userData.hasOwnProperty(clave) && typeof userData[clave] === "string") {
      console.log(typeof userData[clave])
      userData[clave] = userData[clave].replace(/^"|"$/g, ''); // Eliminar comillas del inicio y del final
    }
  }
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [idMax, setIdMax] = useState(null);
  const [selectedPolygonFile, setSelectedPolygonFile] = useState(null);
  const [nombreTabla, setNombreTabla] = useState(null);
  const [idAnalisisAps, setIdAnalisisAps] = useState(null);
  const [idAnalisisCosechaMecanica, setIdAnalisisCosechaMecanica] =
    useState(null);
  const [idAnalisisFertilizacion, setIdAnalisisFertilizacion] = useState(null);
  const [idAnalisisHerbicidas, setIdAnalisisHerbicidas] = useState(null);

  const [idAnalisisBash, setIdAnalisisBash] = useState(null);
  const selectedAnalysisTypeRef = useRef(); // Creando la referencia
  const [socket, setSocket] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [progressMessage, setProgressMessage] = useState("");
  const [selectedZipFile, setSelectedZipFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [datosMapeo, setDatosMapeo] = useState([]);

  if (
    sessionStorage.getItem("Token") === null ||
    sessionStorage.getItem("Token") === "" ||
    sessionStorage.getItem("Token") === undefined ||
    sessionStorage.getItem("userData") === null ||
    sessionStorage.getItem("userData") === "" ||
    sessionStorage.getItem("userData") === undefined
  ) {
    window.location.href = "/login";
  }

  //COSECHA APS

  const [ResponsableAps, setResponsableAps] = useState(null);
  const [fechaInicioCosechaAps, setFechaInicioCosechaAps] = useState(null);
  const [fechaFinCosechaAps, setFechaFinCosechaAps] = useState(null);
  const [nombreFincaAps, setNombreFincaAps] = useState(null);
  const [codigoParcelasAps, setCodigoParcelasAps] = useState(null);
  const [nombreOperadorAps, setNombreOperadorAps] = useState(null);
  const [equipoAps, setEquipoAps] = useState(null);
  const [actividadAps, setActividadAps] = useState(null);
  const [areaNetaAps, setAreaNetaAps] = useState(null);
  const [areaBrutaAps, setAreaBrutaAps] = useState(null);
  const [diferenciaEntreAreasAps, setDiferenciaEntreAreasAps] = useState(null);
  const [horaInicioAps, setHoraInicioAps] = useState(null);
  const [horaFinalAps, setHoraFinalAps] = useState(null);
  const [tiempoTotalActividadesAps, setTiempoTotalActividadesAps] =
    useState(null);
  const [eficienciaAps, setEficienciaAps] = useState(null);
  const [promedioVelocidadAps, setPromedioVelocidadAps] = useState(null);
  //COSECHA MECANICA

  const [nombreResponsableCm, setNombreResponsableCm] = useState(null);
  const [fechaInicioCosechaCm, setFechaInicioCosechaCm] = useState(null);
  const [fechaFinCosechaCm, setFechaFinCosechaCm] = useState(null);
  const [nombreFincaCm, setNombreFincaCm] = useState(null);
  const [codigoParcelaResponsableCm, setCodigoParcelaResponsableCm] =
    useState(null);
  const [nombreOperadorCm, setNombreOperadorCm] = useState(null);
  const [nombreMaquinaCm, setNombreMaquinaCm] = useState(null);
  const [actividadCm, setActividadCm] = useState(null);
  const [areaNetaCm, setAreaNetaCm] = useState(null);
  const [areaBrutaCm, setAreaBrutaCm] = useState(null);
  const [diferenciaDeAreaCm, setDiferenciaDeAreaCm] = useState(null);
  const [horaInicioCm, setHoraInicioCm] = useState(null);
  const [horaFinalCm, setHoraFinalCm] = useState(null);
  const [tiempoTotalActividadCm, setTiempoTotalActividadCm] = useState(null);
  const [eficienciaCm, setEficienciaCm] = useState(null);
  const [promedioVelocidadCm, setPromedioVelocidadCm] = useState(null);
  const [porcentajeAreaPilotoCm, setPorcentajeAreaPilotoCm] = useState(null);
  const [porcentajeAreaAutoTrackerCm, setPorcentajeAreaAutoTrackerCm] =
    useState(null);

  //FERTILIZACIÓN
  const [responsableFertilizacion, setResponsableFertilizacion] =
    useState(null);
  const [fechaInicioFertilizacion, setFechaInicioFertilizacion] =
    useState(null);
  const [fechaFinalFertilizacion, setFechaFinalFertilizacion] = useState(null);
  const [nombreFincaFertilizacion, setNombreFincaFertilizacion] =
    useState(null);
  const [operadorFertilizacion, setOperadorFertilizacion] = useState(null);
  const [equipoFertilizacion, setEquipoFertilizacion] = useState(null);
  const [actividadFertilizacion, setActividadFertilizacion] = useState(null);
  const [areaNetaFertilizacion, setAreaNetaFertilizacion] = useState(null);
  const [areaBrutaFertilizacion, setAreaBrutaFertilizacion] = useState(null);
  const [diferenciaAreaFertilizacion, setDiferenciaAreaFertilizacion] =
    useState(null);
  const [horaInicioFertilizacion, setHoraInicioFertilizacion] = useState(null);
  const [horaFinalFertilizacion, setHoraFinalFertilizacion] = useState(null);
  const [tiempoTotalFertilizacion, setTiempoTotalFertilizacion] =
    useState(null);
  const [eficienciaFertilizacion, setEficienciaFertilizacion] = useState(null);
  const [promedioDosisRealFertilizacion, setPromedioDosisRealFertilizacion] =
    useState(null);
  const [dosisTeoricaFertilizacion, setDosisTeoricaFertilizacion] =
    useState(null);

  //Herbicidas
  const [responsableHerbicidas, setResponsableHerbicidas] = useState(null);
  const [fechaHerbicidas, setFechaHerbicidas] = useState(null);
  const [nombreFincaHerbicidas, setNombreFincaHerbicidas] = useState(null);
  const [parcelaHerbicidas, setParcelaHerbicidas] = useState(null);
  const [operadorHerbicidas, setOperadorHerbicidas] = useState(null);
  const [equipoHerbicidas, setEquipoHerbicidas] = useState(null);
  const [actividadHerbicidas, setActividadHerbicidas] = useState(null);
  const [areaNetaHerbicidas, setAreaNetaHerbicidas] = useState(null);
  const [areaBrutaHerbicidas, setAreaBrutaHerbicidas] = useState(null);
  const [diferenciaDeAreaHerbicidas, setDiferenciaDeAreaHerbicidas] =
    useState(null);
  const [horaInicioHerbicidas, setHoraInicioHerbicidas] = useState(null);
  const [horaFinalHerbicidas, setHoraFinalHerbicidas] = useState(null);
  const [tiempoTotalHerbicidas, setTiempoTotalHerbicidas] = useState(null);
  const [eficienciaHerbicidas, setEficienciaHerbicidas] = useState(null);
  const [promedioVelocidadHerbicidas, setPromedioVelocidadHerbicidas] =
    useState(null);

  const [selectedAnalysisType, setSelectedAnalysisType] = useState("");
  const menuItems = [
    "Dashboard",
    "Administrador",
    "Configuración",
    "Ayuda",
    "Salir",
  ];
  const [datosCargadosAps, setDatosCargadosAps] = useState(false);
  const [datosCargadosCosechaMecanica, setDatosCargadosCosechaMecanica] =
    useState(false);

  const [datosCargadosFertilizacion, setDatosCargadosFertilizacion] =
    useState(false);
  const [datosCargadosHerbicidas, setDatosCargadosHerbicidas] = useState(false);
  const mapRef = useRef(null);
  const [mapLayers, setMapLayers] = useState([]);

  const analysisTemplates = {
    APS: "/templates/APS.csv",
    COSECHA_MECANICA: "/templates/COSECHA_MECANICA.csv",
    FERTILIZACION: "/templates/FERTILIZACION.csv",
    HERBICIDAS: "/templates/HERBICIDAS.csv",
  };
  const CancelToken = axios.CancelToken;
  let cancel;
  const handlePolygonChange = (e) => {
    setSelectedPolygonFile(e.target.files[0]);
  };
  const insertarUltimoAnalisis = async () => {
    if (
      selectedAnalysisTypeRef.current !== null ||
      selectedAnalysisTypeRef.current !== ""
    ) {
      return await axios.post(
        `${API_BASE_URL}dashboard/insert_analisis/${
          userData.ID_USUARIO
        }/${nombreAnalisis(idAnalisisBash)}`
      );
    } else {
      toast.warn("No se pudo insertar el análisis", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const ultimoAnalisis = async () => {
    console.log(
      "ESTOS SON LOS LOGS: ",
      selectedAnalysisTypeRef.current,
      selectedAnalysisTypeRef.current
    );
    if (
      selectedAnalysisTypeRef.current !== null ||
      selectedAnalysisTypeRef.current !== ""
    ) {
      return await axios.get(
        `${API_BASE_URL}dashboard/ultimo_analisis/${selectedAnalysisTypeRef.current}/${userData.ID_USUARIO}`
      );
    } else {
      toast.warn("Debes seleccionar un tipo de análisis.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    const newSocket = io(API_BASE_URL);
    setSocket(newSocket);

    newSocket.on("progressUpdate", (data) => {
      const progressNumber = Number(data.progress);
      const message = data.message;

      setProgress(progressNumber);
      setProgressMessage(message);
      setShowProgressBar(true);
      setShowProgressBar(progressNumber < 100);

      if (progressNumber === 80) {
        console.log("ENTRE AL 80: ");
        newSocket.emit("progressUpdate", {
          progress: 100,
          message: "Finalizado",
        });
        setShowProgressBar(false);
      }
    });

    return () => {
      newSocket.off("progressUpdate");
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      cancel && cancel();
    };
  }, []);

  useEffect(() => {
    return () => {
      setDatosMapeo([]); // Esto limpia el estado de los datos mapeados
      setSelectedFile(null); // Esto limpia el archivo seleccionado
    };
  }, [setDatosMapeo, setSelectedFile]);

  useEffect(() => {
    console.log("VOY A ENTRAR AL SOCKET DE INSERCION: ");
    if (socket) {
      console.log("YA ENTRE AL SOCKET DE INSERCION:");
      socket.on("sendMap", setHtmlContent);
      console.log("ESTE ES EL SOCKET DE INSERCION: ");
      socket.on("datosInsertados", async () => {
        switch (selectedAnalysisTypeRef.current) {
          case "APS":
            await cargaDatosAps();
            break;
          case "COSECHA_MECANICA":
            console.log("ENTRE AL CASE DE MECANICA: ");
            await cargaDatosCosechaMecanica();
            break;
          case "FERTILIZACION":
            await cargaDatosFertilizacion();
            break;
          case "HERBICIDAS":
            await cargaDatosHerbicidas();
            break;
          default:
            toast.warn("Debes seleccionar un tipo de análisis.", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            break;
        }

        socket.disconnect();
      });

      return () => {
        socket.off("sendMap");
        socket.off("datosInsertados");
      };
    } else {
      console.log("NO ENTRE AL SOCKET: ");
    }
  }, [socket]);

  useEffect(() => {
    selectedAnalysisTypeRef.current = selectedAnalysisType;
    switch (selectedAnalysisType) {
      case "APS":
        setNombreTabla("APS");
        setIdAnalisisBash(1);
        break;
      case "COSECHA_MECANICA":
        setNombreTabla("COSECHA_MECANICA");
        setIdAnalisisBash(2);
        break;
      case "HERBICIDAS":
        setNombreTabla("HERBICIDAS");
        setIdAnalisisBash(3);
        break;
      case "FERTILIZACION":
        setNombreTabla("FERTILIZACION");
        setIdAnalisisBash(4);
        break;
      default:
        break;
    }
  }, [selectedAnalysisType, userData.ID_USUARIO]);

  const simulateEvent = () => {
    if (socket) {
      socket.emit("datosInsertados", { data: "mi data" });
    } else {
      // Manejo cuando el socket no está conectado
    }
  };
  function nombreAnalisis(idAnalisis) {
    switch (idAnalisis) {
      case 1:
        return "APS";
        break;
      case 2:
        return "COSECHA_MECANICA";
        break;
      case 3:
        return "HERBICIDAS";
        break;
      case 4:
        return "FERTILIZACION";
        break;
      default:
        break;
    }
  }
  async function handleLogout() {
    sessionStorage.removeItem("Token");
    sessionStorage.removeItem("userData");
    window.location.href = "/login";
  }

  async function manejarSubidaArchivo(event) {
    if (!event.target.files || event.target.files.length === 0) {
      console.error("No se seleccionó ningún archivo");
      return;
    }

    let archivo = event.target.files[0];

    const idAnalisis = await insertarUltimoAnalisis();

    setIdMax(idAnalisis.data.idAnalisis);

    // Aquí la la petición del end point para procesar el Csv:
    //
    let formData = new FormData();
    formData.append("csv", archivo);
    formData.append("idTipoAnalisis", idAnalisis.data.idAnalisis);
    archivo = null;
    const response = await axios.post(
      `${API_BASE_URL}dashboard/procesarCsv/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        }),
      }
    );
    formData = null;
    const data = response.data;

    // Genera un nuevo Blob y File para setSelectedFile

    const csvBlob = new Blob([Papa.unparse(data)], { type: "text/csv" });

    const csvFile = new File([csvBlob], "procesado.csv");

    setSelectedFile(csvFile);
    setDatosMapeo(data.data);
  }
  useEffect(() => {
    if (idAnalisisHerbicidas) {
      Promise.all([
        obtenerResponsableHerbicidas(),
        obtenerFechaHerbicidas(),
        obtenerNombreFincaHerbicidas(),
        obtenerParcelaHerbicidas(),
        obtenerOperadorHerbicidas(),
        obtenerEquipoHerbicidas(),
        obtenerActividadHerbicidas(),
        obtenerAreaNetaHerbicidas(),
        obtenerAreaBrutaHerbicidas(),
        obtenerDiferenciaDeAreaHerbicidas(),
        obtenerHoraInicioHerbicidas(),
        obtenerHoraFinalHerbicidas(),
        obtenerTiempoTotalHerbicidas(),
        obtenerEficienciaHerbicidas(),
        obtenerPromedioVelocidadHerbicidas(),
      ])
        .then(() => {
          setDatosCargadosHerbicidas(true);
        })
        .catch((error) => {
          console.error("Error al cargar datos de APS:", error);
        });
    }
  }, [idAnalisisHerbicidas]);

  const cargaDatosHerbicidas = async () => {
    if (selectedAnalysisTypeRef.current && userData.ID_USUARIO) {
      try {
        const response = await ultimoAnalisis();

        if (response && response.data && response.data.ID_ANALISIS) {
          setIdAnalisisHerbicidas(response.data.ID_ANALISIS);
        } else {
          console.error(
            "Respuesta del último análisis no contiene datos esperados"
          );
        }
      } catch (error) {
        console.error("Error al obtener último análisis:", error);
      }
    }
  };

  useEffect(async () => {
    if (idAnalisisFertilizacion) {
      await Promise.all([
        obtenerResponsableFertilizacion(),
        obtenerFechaInicioFertilizacion(),
        obtenerFechaFinalFertilizacion(),
        obtenerNombreFincaFertilizacion(),
        obtenerOperadorFertilizacion(),
        obtenerEquipoFertilizacion(),
        obtenerActividadFertilizacion(),
        obtenerAreaNetaFertilizacion(),
        obtenerAreaBrutaFertilizacion(),
        obtenerDiferenciaAreaFertilizacion(),
        obtenerHoraInicioFertilizacion(),
        obtenerHoraFinalFertilizacion(),
        obtenerTiempoTotalFertilizacion(),
        obtenerEficienciaFertilizacion(),
        obtenerPromedioDosisRealFertilizacion(),
        obtenerDosisTeoricaFertilizacion(),
      ])
        .then(() => {
          setDatosCargadosFertilizacion(true);
        })
        .catch((error) => {
          console.error("Error al cargar datos de APS:", error);
        });
    }
  }, [idAnalisisFertilizacion]);

  const cargaDatosFertilizacion = async () => {
    if (selectedAnalysisTypeRef.current && userData.ID_USUARIO) {
      try {
        const response = await ultimoAnalisis();

        if (response && response.data && response.data.ID_ANALISIS) {
          setIdAnalisisFertilizacion(response.data.ID_ANALISIS);
        } else {
          console.error(
            "Respuesta del último análisis no contiene datos esperados"
          );
        }
      } catch (error) {
        console.error("Error al obtener último análisis:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("INICIA EL PROCESO DE COSECHA");
        await Promise.all([
          obtenerNombreResponsableCm(),
          obtenerFechaInicioCosechaCm(),
          obtenerFechaFinCosechaCm(),
          obtenerNombreFincaCm(),
          obtenerCodigoParcelaResponsableCm(),
          obtenerNombreOperadorCm(),
          obtenerNombreMaquinaCm(),
          obtenerActividadCm(),
          obtenerAreaNetaCm(),
          obtenerAreaBrutaCm(),
          obtenerDiferenciaDeAreaCm(),
          obtenerHoraInicioCm(),
          obtenerHoraFinalCm(),
          obtenerTiempoTotalActividadCm(),
          obtenerEficienciaCm(),
          obtenerPromedioVelocidadCm(),
          obtenerPorcentajeAreaPilotoCm(),
          obtenerPorcentajeAreaAutoTrackerCm(),
        ]);
        setDatosCargadosCosechaMecanica(true);
      } catch (error) {
        console.error("Error al cargar datos de Cosecha:", error);
      }
    };
    // Llamamos a fetchData solo si idAnalisisCosechaMecanica está disponible
    if (idAnalisisCosechaMecanica) {
      console.log("Llama al método de fetch de Cosecha Mecanica  ");
      fetchData();
    }
  }, [idAnalisisCosechaMecanica]);

  const cargaDatosCosechaMecanica = async () => {
    console.log(
      "ESTOS SON LOS LOGS DE COSECHA: ",
      selectedAnalysisTypeRef.current,
      userData.ID_USUARIO
    );
    if (selectedAnalysisTypeRef.current && userData.ID_USUARIO) {
      console.log("ENTRE AL IF: ");
      try {
        const response = await ultimoAnalisis();
        console.log("RESPUESTA:", response);

        if (response && response.data && response.data.ID_ANALISIS) {
          setIdAnalisisCosechaMecanica(response.data.ID_ANALISIS);
        } else {
          console.error(
            "Respuesta del último análisis no contiene datos esperados"
          );
        }
      } catch (error) {
        console.error("Error al obtener último análisis:", error);
      }
    }
  };

  useEffect(() => {
    if (idAnalisisAps) {
      Promise.all([
        obtenerResponsableAps(),
        obtenerFechaInicioCosechaAps(),
        obtenerFechaFinCosechaAps(),
        obtenerNombreFincaAps(),
        obtenerCodigoParcelasAps(),
        obtenerNombreOperadorAps(),
        obtenerEquipoAps(),
        obtenerActividadAps(),
        obtenerAreaNetaAps(),
        obtenerAreaBrutaAps(),
        obtenerDiferenciaEntreAreasAps(),
        obtenerHoraInicioAps(),
        obtenerHoraFinalAps(),
        obtenerTiempoTotalActividadesAps(),
        obtenerEficienciaAps(),
        obtenerPromedioVelocidadAps(),
      ])
        .then(() => {
          setDatosCargadosAps(true);
        })
        .catch((error) => {
          console.error("Error al cargar datos de APS:", error);
        });
    }
  }, [idAnalisisAps]);
  const cargaDatosAps = async () => {
    if (selectedAnalysisTypeRef.current && userData.ID_USUARIO) {
      try {
        const response = await ultimoAnalisis();

        if (response && response.data && response.data.ID_ANALISIS) {
          setIdAnalisisAps(response.data.ID_ANALISIS);
        } else {
          console.error(
            "Respuesta del último análisis no contiene datos esperados"
          );
        }
      } catch (error) {
        console.error("Error al obtener último análisis:", error);
      }
    }
  };
  /*======================================================
   *  PETICIONES DE APS
   * ======================================================*/
  const obtenerResponsableAps = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/responsableAps/${idAnalisisAps}`
      );
      setResponsableAps(response.data);
    } catch (error) {
      console.error("Error en obtenerResponsableAps:", error);
    }
  };

  const obtenerFechaInicioCosechaAps = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/fechaInicioCosechaAps/${idAnalisisAps}`
      );

      setFechaInicioCosechaAps(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerFechaInicioCosechaAps:", error);
    }
  };

  const obtenerFechaFinCosechaAps = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/fechaFinCosechaAps/${idAnalisisAps}`
      );
      setFechaFinCosechaAps(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerFechaFinCosechaAps:", error);
    }
  };

  const obtenerNombreFincaAps = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/nombreFincaAps/${idAnalisisAps}`
      );
      setNombreFincaAps(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerNombreFincaAps:", error);
    }
  };

  const obtenerCodigoParcelasAps = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/codigoParcelasAps/${idAnalisisAps}`
      );
      setCodigoParcelasAps(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerCodigoParcelasAps:", error);
    }
  };

  const obtenerNombreOperadorAps = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/nombreOperadorAps/${idAnalisisAps}`
      );
      setNombreOperadorAps(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerNombreOperadorAps:", error);
    }
  };

  const obtenerEquipoAps = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/equipoAps/${idAnalisisAps}`
      );
      setEquipoAps(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerEquipoAps:", error);
    }
  };

  const obtenerActividadAps = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/actividadAps/${idAnalisisAps}`
      );
      setActividadAps(response.data);
    } catch (error) {
      console.error("Error en obtenerActividadAps:", error);
    }
  };

  const obtenerAreaNetaAps = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/areaNetaAps/${idAnalisisAps}`
      );
      setAreaNetaAps(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerAreaNetaAps:", error);
    }
  };

  const obtenerAreaBrutaAps = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/areaBrutaAps/${idAnalisisAps}`
      );
      setAreaBrutaAps(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerAreaBrutaAps:", error);
    }
  };

  const obtenerDiferenciaEntreAreasAps = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/diferenciaEntreAreasAps/${idAnalisisAps}`
      );
      setDiferenciaEntreAreasAps(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerDiferenciaEntreAreasAps:", error);
    }
  };

  const obtenerHoraInicioAps = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/horaInicioAps/${idAnalisisAps}`
      );
      setHoraInicioAps(response.data);
    } catch (error) {
      console.error("Error en obtenerHoraInicioAps:", error);
    }
  };

  const obtenerHoraFinalAps = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/horaFinalAps/${idAnalisisAps}`
      );
      setHoraFinalAps(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerHoraFinalAps:", error);
    }
  };

  const obtenerTiempoTotalActividadesAps = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/tiempoTotalActividadesAps/${idAnalisisAps}`
      );
      setTiempoTotalActividadesAps(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerTiempoTotalActividadesAps:", error);
    }
  };

  const obtenerEficienciaAps = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/eficienciaAps/${idAnalisisAps}`
      );
      setEficienciaAps(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerEficienciaAps:", error);
    }
  };

  const obtenerPromedioVelocidadAps = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/promedioVelocidadAps/${idAnalisisAps}`
      );
      setPromedioVelocidadAps(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerPromedioVelocidadAps:", error);
    }
  };
  /*======================================================
   *  PETICIONES DE COSECHA_MECANICA
   * ======================================================*/

  const obtenerNombreResponsableCm = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/nombreResponsableCm/${idAnalisisCosechaMecanica}`
      );

      setNombreResponsableCm(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerNombreResponsableCm:", error);
    }
  };

  const obtenerFechaInicioCosechaCm = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/fechaInicioCosechaCm/${idAnalisisCosechaMecanica}`
      );
      setFechaInicioCosechaCm(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerFechaInicioCosechaCm:", error);
    }
  };

  const obtenerFechaFinCosechaCm = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/fechaFinCosechaCm/${idAnalisisCosechaMecanica}`
      );
      setFechaFinCosechaCm(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerFechaFinCosechaCm:", error);
    }
  };

  const obtenerNombreFincaCm = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/nombreFincaCm/${idAnalisisCosechaMecanica}`
      );
      setNombreFincaCm(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerNombreFincaCm:", error);
    }
  };

  const obtenerCodigoParcelaResponsableCm = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/codigoParcelaResponsableCm/${idAnalisisCosechaMecanica}`
      );
      setCodigoParcelaResponsableCm(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerCodigoParcelaResponsableCm:", error);
    }
  };

  const obtenerNombreOperadorCm = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/nombreOperadorCm/${idAnalisisCosechaMecanica}`
      );
      setNombreOperadorCm(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerNombreOperadorCm:", error);
    }
  };

  const obtenerNombreMaquinaCm = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/nombreMaquinaCm/${idAnalisisCosechaMecanica}`
      );
      setNombreMaquinaCm(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerNombreMaquinaCm:", error);
    }
  };

  const obtenerActividadCm = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/actividadCm/${idAnalisisCosechaMecanica}`
      );
      setActividadCm(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerActividadCm:", error);
    }
  };

  const obtenerAreaNetaCm = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/areaNetaCm/${idAnalisisCosechaMecanica}`
      );
      setAreaNetaCm(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerAreaNetaCm:", error);
    }
  };

  const obtenerAreaBrutaCm = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/areaBrutaCm/${idAnalisisCosechaMecanica}`
      );
      setAreaBrutaCm(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerAreaBrutaCm:", error);
    }
  };

  const obtenerDiferenciaDeAreaCm = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/diferenciaDeAreaCm/${idAnalisisCosechaMecanica}`
      );
      setDiferenciaDeAreaCm(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerDiferenciaDeAreaCm:", error);
    }
  };

  const obtenerHoraInicioCm = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/horaInicioCm/${idAnalisisCosechaMecanica}`
      );
      setHoraInicioCm(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerHoraInicioCm:", error);
    }
  };

  const obtenerHoraFinalCm = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/horaFinalCm/${idAnalisisCosechaMecanica}`
      );
      setHoraFinalCm(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerHoraFinalCm:", error);
    }
  };

  const obtenerTiempoTotalActividadCm = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/tiempoTotalActividadCm/${idAnalisisCosechaMecanica}`
      );
      setTiempoTotalActividadCm(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerTiempoTotalActividadCm:", error);
    }
  };

  const obtenerEficienciaCm = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/eficienciaCm/${idAnalisisCosechaMecanica}`
      );
      setEficienciaCm(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerEficienciaCm:", error);
    }
  };

  const obtenerPromedioVelocidadCm = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/promedioVelocidadCm/${idAnalisisCosechaMecanica}`
      );
      setPromedioVelocidadCm(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerPromedioVelocidadCm:", error);
    }
  };

  const obtenerPorcentajeAreaPilotoCm = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/porcentajeAreaPilotoCm/${idAnalisisCosechaMecanica}`
      );
      setPorcentajeAreaPilotoCm(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerPorcentajeAreaPilotoCm:", error);
    }
  };

  const obtenerPorcentajeAreaAutoTrackerCm = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}dashboard/porcentajeAreaAutoTrackerCm/${idAnalisisCosechaMecanica}`
      );
      setPorcentajeAreaAutoTrackerCm(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerPorcentajeAreaAutoTrackerCm:", error);
    }
  };

  /*======================================================
   *  PETICIONES DE FERTILIZACIÓN
   * ======================================================*/
  const obtenerResponsableFertilizacion = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/responsableFertilizacion/${idAnalisisFertilizacion}`
      );
      setResponsableFertilizacion(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerResponsableFertilizacion:", error);
    }
  };

  const obtenerFechaInicioFertilizacion = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/fechaInicioFertilizacion/${idAnalisisFertilizacion}`
      );
      setFechaInicioFertilizacion(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerFechaInicioFertilizacion:", error);
    }
  };

  const obtenerFechaFinalFertilizacion = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/fechaFinalFertilizacion/${idAnalisisFertilizacion}`
      );
      setFechaFinalFertilizacion(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerFechaFinalFertilizacion:", error);
    }
  };

  const obtenerNombreFincaFertilizacion = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/nombreFincaFertilizacion/${idAnalisisFertilizacion}`
      );
      setNombreFincaFertilizacion(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerNombreFincaFertilizacion:", error);
    }
  };

  const obtenerOperadorFertilizacion = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/operadorFertilizacion/${idAnalisisFertilizacion}`
      );
      setOperadorFertilizacion(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerOperadorFertilizacion:", error);
    }
  };

  const obtenerEquipoFertilizacion = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/equipoFertilizacion/${idAnalisisFertilizacion}`
      );
      setEquipoFertilizacion(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerEquipoFertilizacion:", error);
    }
  };

  const obtenerActividadFertilizacion = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/actividadFertilizacion/${idAnalisisFertilizacion}`
      );
      setActividadFertilizacion(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerActividadFertilizacion:", error);
    }
  };

  const obtenerAreaNetaFertilizacion = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/areaNetaFertilizacion/${idAnalisisFertilizacion}`
      );
      setAreaNetaFertilizacion(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerAreaNetaFertilizacion:", error);
    }
  };

  const obtenerAreaBrutaFertilizacion = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/areaBrutaFertilizacion/${idAnalisisFertilizacion}`
      );
      setAreaBrutaFertilizacion(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerAreaBrutaFertilizacion:", error);
    }
  };

  const obtenerDiferenciaAreaFertilizacion = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/diferenciaAreaFertilizacion/${idAnalisisFertilizacion}`
      );
      setDiferenciaAreaFertilizacion(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerDiferenciaAreaFertilizacion:", error);
    }
  };

  const obtenerHoraInicioFertilizacion = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/horaInicioFertilizacion/${idAnalisisFertilizacion}`
      );
      setHoraInicioFertilizacion(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerHoraInicioFertilizacion:", error);
    }
  };

  const obtenerHoraFinalFertilizacion = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/horaFinalFertilizacion/${idAnalisisFertilizacion}`
      );
      setHoraFinalFertilizacion(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerHoraFinalFertilizacion:", error);
    }
  };

  const obtenerTiempoTotalFertilizacion = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/tiempoTotalFertilizacion/${idAnalisisFertilizacion}`
      );
      setTiempoTotalFertilizacion(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerTiempoTotalFertilizacion:", error);
    }
  };

  const obtenerEficienciaFertilizacion = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/eficienciaFertilizacion/${idAnalisisFertilizacion}`
      );
      setEficienciaFertilizacion(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerEficienciaFertilizacion:", error);
    }
  };

  const obtenerPromedioDosisRealFertilizacion = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/promedioDosisRealFertilizacion/${idAnalisisFertilizacion}`
      );
      setPromedioDosisRealFertilizacion(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerPromedioDosisRealFertilizacion:", error);
    }
  };

  const obtenerDosisTeoricaFertilizacion = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/dosisTeoricaFertilizacion/${idAnalisisFertilizacion}`
      );
      setDosisTeoricaFertilizacion(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerDosisTeoricaFertilizacion:", error);
    }
  };
  function displayValue(value) {
    if (value === undefined || value === null) {
      return "N/A";
    } else if (Array.isArray(value)) {
      return value.join("\n");
    } else if (typeof value === "object") {
      // Devolver solo los valores de las propiedades del objeto
      return Object.values(value).join(", ");
    } else if (
      typeof value === "string" &&
      value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
    ) {
      // Formatear la cadena de fecha
      const date = new Date(value);
      return date.toLocaleDateString(); // Formatea la fecha a un formato legible
    } else {
      return value;
    }
  }

  /*======================================================
   *  PETICIONES DE HERBICIDAS
   * ======================================================*/

  const obtenerResponsableHerbicidas = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/responsableHerbicidas/${idAnalisisHerbicidas}`
      );
      setResponsableHerbicidas(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerResponsableHerbicidas:", error);
    }
  };

  const obtenerFechaHerbicidas = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/fechaHerbicidas/${idAnalisisHerbicidas}`
      );
      setFechaHerbicidas(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerFechaHerbicidas:", error);
    }
  };

  const obtenerNombreFincaHerbicidas = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/nombreFincaHerbicidas/${idAnalisisHerbicidas}`
      );
      setNombreFincaHerbicidas(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerNombreFincaHerbicidas:", error);
    }
  };

  const obtenerParcelaHerbicidas = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/parcelaHerbicidas/${idAnalisisHerbicidas}`
      );
      setParcelaHerbicidas(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerParcelaHerbicidas:", error);
    }
  };

  const obtenerOperadorHerbicidas = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/operadorHerbicidas/${idAnalisisHerbicidas}`
      );
      setOperadorHerbicidas(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerOperadorHerbicidas:", error);
    }
  };

  const obtenerEquipoHerbicidas = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/equipoHerbicidas/${idAnalisisHerbicidas}`
      );
      setEquipoHerbicidas(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerEquipoHerbicidas:", error);
    }
  };

  const obtenerActividadHerbicidas = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/actividadHerbicidas/${idAnalisisHerbicidas}`
      );
      setActividadHerbicidas(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerActividadHerbicidas:", error);
    }
  };

  const obtenerAreaNetaHerbicidas = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/areaNetaHerbicidas/${idAnalisisHerbicidas}`
      );
      setAreaNetaHerbicidas(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerAreaNetaHerbicidas:", error);
    }
  };

  const obtenerAreaBrutaHerbicidas = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/areaBrutaHerbicidas/${idAnalisisHerbicidas}`
      );
      setAreaBrutaHerbicidas(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerAreaBrutaHerbicidas:", error);
    }
  };

  const obtenerDiferenciaDeAreaHerbicidas = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/diferenciaDeAreaHerbicidas/${idAnalisisHerbicidas}`
      );
      setDiferenciaDeAreaHerbicidas(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerDiferenciaDeAreaHerbicidas:", error);
    }
  };

  const obtenerHoraInicioHerbicidas = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/horaInicioHerbicidas/${idAnalisisHerbicidas}`
      );
      setHoraInicioHerbicidas(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerHoraInicioHerbicidas:", error);
    }
  };

  const obtenerHoraFinalHerbicidas = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/horaFinalHerbicidas/${idAnalisisHerbicidas}`
      );
      setHoraFinalHerbicidas(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerHoraFinalHerbicidas:", error);
    }
  };

  const obtenerTiempoTotalHerbicidas = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/tiempoTotalHerbicidas/${idAnalisisHerbicidas}`
      );
      setTiempoTotalHerbicidas(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerTiempoTotalHerbicidas:", error);
    }
  };

  const obtenerEficienciaHerbicidas = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/eficienciaHerbicidas/${idAnalisisHerbicidas}`
      );
      setEficienciaHerbicidas(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerEficienciaHerbicidas:", error);
    }
  };

  const obtenerPromedioVelocidadHerbicidas = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/promedioVelocidadHerbicidas/${idAnalisisHerbicidas}`
      );
      setPromedioVelocidadHerbicidas(response.data[0]);
    } catch (error) {
      console.error("Error en obtenerPromedioVelocidadHerbicidas:", error);
    }
  };

  const execBash = async () => {
    let validar = "ok";

    if (!selectedFile || !selectedZipFile) {
      toast.warn("Por favor, selecciona ambos archivos.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    } else if (!idAnalisisBash) {
      toast.error("Debe seleccionar un análisis antes de continuar", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
        hideProgressBar: true,
      });
    }
    const formData = new FormData();
    formData.append("csv", selectedFile);
    formData.append("polygon", selectedZipFile);
    const processBatch = async (offset) => {
      try {
        console.log("ESTA ES LA RESPUESTA DE BASH: ");
        const response = await axios.post(
          `${API_BASE_URL}dashboard/execBash/${userData.ID_USUARIO}/${idAnalisisBash}/${idMax}/${offset}/${validar}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response);
      } catch (error) {
        // Registro detallado del error
        console.error("Error al procesar el lote:");
        console.error("Mensaje de error:", error.message);
        console.error("Tipo de error:", error.name);
        if (error.response) {
          // Detalles específicos cuando el error es de una respuesta HTTP
          console.error(
            "Datos de la respuesta del error:",
            error.response.data
          );
          console.error(
            "Estado de la respuesta del error:",
            error.response.status
          );
          console.error(
            "Encabezados de la respuesta del error:",
            error.response.headers
          );
        } else {
          // En caso de que el error no sea una respuesta HTTP
          console.error("Stack del error:", error.stack);
        }
      }
    };
    console.log("Se llama al método de bash");
    processBatch(0);
  };

  return (
    <div className="dashboard">
      <ProgressBar
        progress={progress}
        message={progressMessage}
        show={showProgressBar}
      />
      <Sidebar
        profileImage={profilePicture}
        name={userData.NOMBRE}
        apellido={userData.APELLIDO}
        menuItems={menuItems}
        isOpen={sidebarOpen} //
        setIsOpen={setSidebarOpen}
      />
      <main className={`main-content ${!sidebarOpen ? "expand" : ""}`}>
        <div>
          <h1 className="dashboard-title">Resumen de Análisis</h1>
          <section className="map-section">
            {selectedZipFile && selectedFile && (
              <MapComponent csvData={datosMapeo} zipFile={selectedZipFile} />
            )}
          </section>
        </div>

        <section className="data-section">
          {datosCargadosAps && selectedAnalysisType === "APS" && (
            <>
              <DataCard title="Responsable">
                {displayValue(ResponsableAps)}
              </DataCard>
              <DataCard title="Fecha Inicio Cosecha">
                {displayValue(fechaInicioCosechaAps)}
              </DataCard>
              <DataCard title="Fecha Fin Cosecha">
                {displayValue(fechaFinCosechaAps)}
              </DataCard>
              <DataCard title="Nombre operador">
                {displayValue(nombreOperadorAps)}
              </DataCard>
              <DataCard title="Equipo">{displayValue(equipoAps)}</DataCard>
              <DataCard title="Actividad">
                {displayValue(actividadAps)}
              </DataCard>
              <DataCard title="Area Neta">{displayValue(areaNetaAps)}</DataCard>
              <DataCard title="Area Bruta">
                {displayValue(areaBrutaAps)}
              </DataCard>
              <DataCard title="Diferencia Entre Areas">
                {displayValue(diferenciaEntreAreasAps)}
              </DataCard>
              <DataCard title="Hora Inicio APS">
                {displayValue(horaInicioAps)}
              </DataCard>
              <DataCard title="Hora Final APS">
                {displayValue(horaFinalAps)}
              </DataCard>
              <DataCard title="Tiempo Total Actividades">
                {displayValue(tiempoTotalActividadesAps)}
              </DataCard>
              <DataCard title="Eficiancia">
                {displayValue(eficienciaAps)}
              </DataCard>
              <DataCard title="Promedio Velocidad">
                {displayValue(promedioVelocidadAps)}
              </DataCard>
            </>
          )}
          {datosCargadosCosechaMecanica &&
            selectedAnalysisType === "COSECHA_MECANICA" && (
              <>
                <DataCard title="Nombre Responsable">
                  {displayValue(nombreResponsableCm)}
                </DataCard>
                <DataCard title="Fecha Inicio Cosecha">
                  {displayValue(fechaInicioCosechaCm)}
                </DataCard>
                <DataCard title="Fecha Fin Cosecha">
                  {displayValue(fechaFinCosechaCm)}
                </DataCard>
                <DataCard title="Nombre Finca">
                  {displayValue(nombreFincaCm)}
                </DataCard>
                <DataCard title="Codigo Parsela">
                  {displayValue(codigoParcelaResponsableCm)}
                </DataCard>
                <DataCard title="Nombre Operador">
                  {displayValue(nombreOperadorCm)}
                </DataCard>
                <DataCard title="No. Maquina">
                  {displayValue(nombreMaquinaCm)}
                </DataCard>
                <DataCard title="Actividad">
                  {displayValue(actividadCm)}
                </DataCard>
                <DataCard title="Area Neta">
                  {displayValue(areaNetaCm)}
                </DataCard>
                <DataCard title="Area Bruta">
                  {displayValue(areaBrutaCm)}
                </DataCard>
                <DataCard title="Diferencia de Area">
                  {displayValue(diferenciaDeAreaCm)}
                </DataCard>
                <DataCard title="Hora Inicio">
                  {displayValue(horaInicioCm)}
                </DataCard>
                <DataCard title="Hora Fin">
                  {displayValue(horaFinalCm)}
                </DataCard>
                <DataCard title="Tiempo total Actividad">
                  {displayValue(tiempoTotalActividadCm)}
                </DataCard>
                <DataCard title="Eficiencia">
                  {displayValue(eficienciaCm)}
                </DataCard>
                <DataCard title="Promedio Velocidad">
                  {displayValue(promedioVelocidadCm)}
                </DataCard>
                <DataCard title="Porcentaje Area Piloto">
                  {displayValue(porcentajeAreaPilotoCm)}
                </DataCard>
                <DataCard title="Porcentaje Area AutoTracker">
                  {displayValue(porcentajeAreaAutoTrackerCm)}
                </DataCard>
              </>
            )}
          {datosCargadosFertilizacion &&
            selectedAnalysisType === "FERTILIZACION" && (
              <>
                <DataCard title="Responsable">
                  {displayValue(responsableFertilizacion)}
                </DataCard>
                <DataCard title="Fecha Inicio Fertilización">
                  {displayValue(fechaInicioFertilizacion)}
                </DataCard>
                <DataCard title="Fecha Final Fertilización">
                  {displayValue(fechaFinalFertilizacion)}
                </DataCard>
                <DataCard title="Nombre Finca">
                  {displayValue(nombreFincaFertilizacion)}
                </DataCard>
                <DataCard title="Operador">
                  {displayValue(operadorFertilizacion)}
                </DataCard>
                <DataCard title="Equipo">
                  {displayValue(equipoFertilizacion)}
                </DataCard>
                <DataCard title="Actividad">
                  {displayValue(actividadFertilizacion)}
                </DataCard>
                <DataCard title="Area Neta">
                  {displayValue(areaNetaFertilizacion)}
                </DataCard>
                <DataCard title="Area Bruta">
                  {displayValue(areaBrutaFertilizacion)}
                </DataCard>
                <DataCard title="Diferencia Area">
                  {displayValue(diferenciaAreaFertilizacion)}
                </DataCard>
                <DataCard title="Hora Inicio">
                  {displayValue(horaInicioFertilizacion)}
                </DataCard>
                <DataCard title="Hora Fin">
                  {displayValue(horaFinalFertilizacion)}
                </DataCard>
                <DataCard title="Tiempo Total">
                  {displayValue(tiempoTotalFertilizacion)}
                </DataCard>
                <DataCard title="Eficiencia">
                  {displayValue(eficienciaFertilizacion)}
                </DataCard>
                <DataCard title="Promedio Dosis Real">
                  {displayValue(promedioDosisRealFertilizacion)}
                </DataCard>
                <DataCard title="Dosis Teorica">
                  {displayValue(dosisTeoricaFertilizacion)}
                </DataCard>
              </>
            )}
          {datosCargadosHerbicidas && selectedAnalysisType === "HERBICIDAS" && (
            <>
              <DataCard title="Responsable">
                {displayValue(responsableHerbicidas)}
              </DataCard>
              <DataCard title="Herbicidas">
                {displayValue(fechaHerbicidas)}
              </DataCard>
              <DataCard title="Nombre Finca">
                {displayValue(nombreFincaHerbicidas)}
              </DataCard>
              <DataCard title="Parcela">
                {displayValue(parcelaHerbicidas)}
              </DataCard>
              <DataCard title="Operador">
                {displayValue(operadorHerbicidas)}
              </DataCard>
              <DataCard title="Equipo">
                {displayValue(equipoHerbicidas)}
              </DataCard>
              <DataCard title="Actividad">
                {displayValue(actividadHerbicidas)}
              </DataCard>
              <DataCard title="Area Neta">
                {displayValue(areaNetaHerbicidas)}
              </DataCard>
              <DataCard title="Area Bruta">
                {displayValue(areaBrutaHerbicidas)}
              </DataCard>
              <DataCard title="Diferencia De Area">
                {displayValue(diferenciaDeAreaHerbicidas)}
              </DataCard>
              <DataCard title="Hora Inicio">
                {displayValue(horaInicioHerbicidas)}
              </DataCard>
              <DataCard title="Hora Final">
                {displayValue(horaFinalHerbicidas)}
              </DataCard>
              <DataCard title="Tiempo Total">
                {displayValue(tiempoTotalHerbicidas)}
              </DataCard>
              <DataCard title="Eficiencia">
                {displayValue(eficienciaHerbicidas)}
              </DataCard>
              <DataCard title="Promedio Velocidad">
                {displayValue(promedioVelocidadHerbicidas)}
              </DataCard>
            </>
          )}
        </section>

        <div className="analysis-controls">
        <label htmlFor="csv-file" className="custom-file-upload">
            <button
              onClick={handleLogout}
            >
            Salir
            </button>
          </label>
          <label htmlFor="csv-file" className="custom-file-upload">
            <input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={manejarSubidaArchivo}
            />
            Selecciona tu CSV
          </label>
          <label htmlFor="zip-file" className="custom-file-upload">
            <input
              id="zip-file"
              type="file"
              onChange={(e) => {
                setSelectedZipFile(e.target.files[0]);
              }}
              accept=".zip"
            />
            Selecciona tu ZIP
          </label>
          <a
            href={
              selectedAnalysisType
                ? analysisTemplates[selectedAnalysisType]
                : "#"
            }
            download
            className="download-template"
          >
            Descargar plantilla
          </a>
          <select
            value={selectedAnalysisType}
            onChange={(e) => setSelectedAnalysisType(e.target.value)}
            className="type-selector"
          >
            <option value="">Seleccionar tipo de análisis</option>
            {Object.keys(analysisTemplates).map((type) => (
              <option value={type} key={type}>
                {type.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <button onClick={execBash} className="action-button">
            Realizar análisis
          </button>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
