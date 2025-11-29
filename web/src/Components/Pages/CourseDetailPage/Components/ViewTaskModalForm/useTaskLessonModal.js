import {useDispatch, useSelector} from "react-redux";
import {setSelectedTaskToView} from "../../../../../Redux/Slices/tasksSlice.js";
import {notification} from "antd";
import CONFIG from "../../../../../Core/сonfig.js";
import {useState} from "react";
import {useGetTaskFilesListQuery} from "../../../../../Api/tasksApi.js";


const useViewTaskModal = () => {
    const dispatch = useDispatch();

    const {
        selectedTaskToView
    } = useSelector((state) => state.tasks);

    const modalIsOpen = selectedTaskToView !== null;

    const handleClose = () => {
        dispatch(setSelectedTaskToView(null));
    };

    const {
        data: currentTaskFiles = [],
        isLoading: isCurrentTaskFilesLoading,
        isError: isCurrentTaskFilesError
    } = useGetTaskFilesListQuery(selectedTaskToView?.id, {
        skip: !selectedTaskToView?.id
    });

    const [downloadingFiles, setDownloadingFiles] = useState({});

    const downloadFile = async (fileId, fileName) => {
        try {
            setDownloadingFiles((prev) => ({...prev, [fileId]: true}));

            const token = localStorage.getItem('access_token');
            if (!token) {
                notification.error({
                    title: "Ошибка",
                    description: "Токен не найден",
                    placement: "topRight",
                });
                return;
            }

            const response = await fetch(`${CONFIG.BASE_URL}/tasks/file/${fileId}/`, {
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
        selectedTaskToView,
        modalIsOpen,
        handleClose,
        currentTaskFiles,
        isCurrentTaskFilesLoading,
        isCurrentTaskFilesError,
        downloadFile,
        downloadingFiles
    }
};

export default useViewTaskModal;