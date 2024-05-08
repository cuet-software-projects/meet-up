import { getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAppSelector } from "../app/hooks";
import { usersRef } from "../utils/firebaseConfig";
import { UserType } from "../utils/types";

function useFetchUsers(){
    const [users,setUsers]=useState<Array<UserType>>([]);
    const uid=useAppSelector((store)=>store.auth.userInfo?.uid);
    useEffect(()=>{
        if(uid){
            const getUsers=async ()=>{
                const fireStoreQuery=query(usersRef,where("uid","!=",uid));
                const data=await getDocs(fireStoreQuery);
                const firebaseUsers: Array<UserType> = [];
                 data.forEach((user)=>{
                    const userData:UserType=user.data() as UserType;
                    firebaseUsers.push({
                        ...userData,
                        label:userData.name,
                    })
                 });
                 setUsers(firebaseUsers);
            }
            getUsers();
        }
    },[uid]);
    return [users];
}
export default useFetchUsers;