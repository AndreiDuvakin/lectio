const useLoadingIndicatorUI = () => {
    const containerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
    };

    const iconStyle = {
        fontSize: 64,
        color: "#1890ff",
    };

    return {
        containerStyle,
        iconStyle,
    };
};

export default useLoadingIndicatorUI;