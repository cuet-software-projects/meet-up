import React from "react";
import { EuiProvider, EuiFlexGroup, EuiFlexItem, EuiPanel, EuiImage, EuiText, EuiSpacer, EuiTextColor, EuiButton } from "@elastic/eui";
import animation from '../assets/animation.gif';
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { setUser } from "../app/slice/AuthSlice";
import { firebaseAuth, firebaseDB, usersRef } from "../utils/firebaseConfig";
import { collection, query, where, addDoc, getDocs } from "firebase/firestore";
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
  } from "firebase/auth";
import logo from '../assets/logo.png'
function Login() {
    const navigate = useNavigate();
  const dispatch = useAppDispatch();

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) navigate("/");
  });

  const login = async () => {
    const provider = new GoogleAuthProvider();
    const {
      user: { displayName, email, uid },
    } = await signInWithPopup(firebaseAuth, provider);

    if (email) {
      const firestoreQuery = query(usersRef, where("uid", "==", uid));
      const fetchedUser = await getDocs(firestoreQuery);
      if (fetchedUser.docs.length === 0) {
        await addDoc(collection(firebaseDB, "users"), {
          uid,
          name: displayName,
          email,
        });
      }
      console.log(email,displayName,uid)
      dispatch(setUser({ uid, email: email, name: displayName }));
      navigate("/");
    }
  };
    
    return (
        <EuiProvider colorMode="dark">
            <EuiFlexGroup justifyContent="center" alignItems="center" style={{ width: "100vw", height: "100vh" }}>
                <EuiFlexItem grow={false}>
                    <EuiPanel paddingSize="xl">
                        <EuiFlexGroup justifyContent="center" alignItems="center">
                            <EuiFlexItem>
                                <EuiImage src={animation}  ></EuiImage>
                            </EuiFlexItem>
                            <EuiFlexItem>
                                <EuiImage src={logo} size="230px"></EuiImage>
                                <EuiSpacer size="xs" />
                                <EuiText textAlign="center" grow={false}>
                                    <h3>
                                        <EuiTextColor>One Platform to</EuiTextColor>
                                        <EuiTextColor color="#0b5cff"> connect</EuiTextColor>
                                    </h3>
                                </EuiText>
                                <EuiSpacer size="l" />
                                <EuiButton color="primary" onClick={login}>Login With Google</EuiButton>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    </EuiPanel>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiProvider>
    )
}
export default Login