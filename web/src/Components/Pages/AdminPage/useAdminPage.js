import {useGetAllUsersQuery, useGetAuthenticatedUserDataQuery} from "../../../Api/usersApi.js";
import {useGetAllRolesQuery} from "../../../Api/rolesApi.js";
import {useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import {setOpenModalCreateUser, setSelectedUserToUpdate} from "../../../Redux/Slices/usersSlice.js";


const useAdminPage = () => {
    const dispatch = useDispatch();
    const {
        data: currentUser = {},
        isLoading: currentUserIsLoading,
        isError: currentUserIsError,
    } = useGetAuthenticatedUserDataQuery(undefined);

    const [
        searchString,
        setSearchString,
    ] = useState("");

    const {
        data: usersData = [],
        isLoading: usersIsLoading,
        isError: usersIsError,
    } = useGetAllUsersQuery(undefined, {
        pollingInterval: 20000,
    });

    const {
        data: rolesData = [],
        isLoading: rolesIsLoading,
        isError: rolesIsError,
    } = useGetAllRolesQuery(undefined, {
        pollingInterval: 20000,
    });

    const handleSearch = (e) => {
        setSearchString(e.target.value);
    };

    const filteredUsers = useMemo(() => {
        return usersData.filter((user) => {
            return Object.entries(user).some(([key, value]) => {
                if (typeof value === "string") {
                    return value.toString().toLowerCase().includes(searchString.toLowerCase());
                }
            });
        });
    }, [usersData, searchString]);

    const handleSelectUserToEdit = (user) => {
        dispatch(setSelectedUserToUpdate(user));
    };

    const openCreateModal = () => {
        dispatch(setOpenModalCreateUser(true));
    };

    return {
        handleSelectUserToEdit,
        rolesData,
        filteredUsers,
        handleSearch,
        isLoading: usersIsLoading | rolesIsLoading | currentUserIsLoading,
        isError: usersIsError | rolesIsError | currentUserIsError,
        openCreateModal,
        currentUser,
    };
};

export default useAdminPage;