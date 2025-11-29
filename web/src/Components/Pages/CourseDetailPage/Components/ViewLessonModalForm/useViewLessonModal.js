import {useDispatch, useSelector} from "react-redux";
import {setSelectedLessonToView} from "../../../../../Redux/Slices/lessonsSlice.js";
import {useGetLessonFilesListQuery} from "../../../../../Api/lessonsApi.js";
import {notification} from "antd";
import CONFIG from "../../../../../Core/сonfig.js";
import {useState} from "react";


const useViewLessonModal = () => {
    const dispatch = useDispatch();

    const {
        selectedLessonToView
    } = useSelector((state) => state.lessons);

    const modalIsOpen = selectedLessonToView !== null;

    const handleClose = () => {
        dispatch(setSelectedLessonToView(null));
    };

    const {
        data: currentLessonFiles = [],
        isLoading: isCurrentLessonFilesLoading,
        isError: isCurrentLessonFilesError
    } = useGetLessonFilesListQuery(selectedLessonToView?.id, {
        skip: !selectedLessonToView?.id
    });

    const [downloadingFiles, setDownloadingFiles] = useState({});

    const downloadFile = async (fileId, fileName) => {
        try {
            setDownloadingFiles((prev) => ({ ...prev, [fileId]: true }));

            const token = localStorage.getItem('access_token');
            if (!token) {
                notification.error({
                    title: "Ошибка",
                    description: "Токен не найден",
                    placement: "topRight",
                });
                return;
            }

            const response = await fetch(`${CONFIG.BASE_URL}/lessons/file/${fileId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });


            if (!response.ok) {
                const errorText = await response.text();
                notification.error({
                    title: "Ошибка",
                    description: errorText || "Не удалось скачать файл",
                    placement: "topRight",
                });
                return;
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || contentType.includes('text/html')) {
                const errorText = await response.text();
                notification.error({
                    title: "Ошибка",
                    description: errorText || "Не удалось скачать файл",
                    placement: "topRight",
                });
                return;
            }

            let safeFileName = fileName || "file";
            if (!safeFileName.match(/\.[a-zA-Z0-9]+$/)) {
                if (contentType.includes('application/pdf')) {
                    safeFileName += '.pdf';
                } else if (contentType.includes('image/jpeg')) {
                    safeFileName += '.jpg';
                } else if (contentType.includes('image/png')) {
                    safeFileName += '.png';
                } else {
                    safeFileName += '.bin';
                }
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", safeFileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            notification.error({
                title: "Ошибка",
                description: error.message || "Не удалось скачать файл",
                placement: "topRight",
            });
        } finally {
            setDownloadingFiles((prev) => ({...prev, [fileId]: false}));
        }
    };


    return {
        selectedLessonToView,
        modalIsOpen,
        handleClose,
        currentLessonFiles,
        isCurrentLessonFilesLoading,
        isCurrentLessonFilesError,
        downloadFile,
        downloadingFiles
    }
};

export default useViewLessonModal;