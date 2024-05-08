import { EuiHeader, EuiButtonIcon, EuiHeaderSectionItem, EuiHeaderLogo, EuiFlexGroup, EuiFlexItem,EuiText } from "@elastic/eui";
import { useAppSelector } from "../app/hooks";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../utils/firebaseConfig";
function Header() {
    const logout = () => {
        signOut(firebaseAuth);
    };
    const userName = useAppSelector((zoomApp) => zoomApp.auth.userInfo?.name);
    return (
            <EuiHeader style={{ height: "10vh" }}>
                <EuiFlexGroup justifyContent="center" alignItems="center">
                    <EuiFlexItem justifyContent='flexStart'>
                        <EuiHeaderSectionItem>
                            <EuiHeaderLogo>Elastic</EuiHeaderLogo>
                        </EuiHeaderSectionItem>
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiHeaderSectionItem>
                            <EuiFlexGroup grow={false} style={{ gap: "2vw" }}>
                                <EuiFlexItem grow={false}>
                                    <EuiText grow={false}>Hello,</EuiText>
                                </EuiFlexItem>
                                <EuiFlexItem grow={false}>
                                <EuiText color="success">{userName}</EuiText>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                        </EuiHeaderSectionItem>

                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiHeaderSectionItem>
                            <EuiFlexGroup
                                justifyContent="center"
                                alignItems="center"
                                direction="row"
                                style={{ gap: "2vw" }}
                            >
                                <EuiFlexItem grow={false} style={{ flexBasis: "fit-content" }}>
                                    <EuiButtonIcon
                                        iconType="moon"
                                        display="fill"
                                        size="s"
                                        color="ghost"
                                        aria-label="theme-button-dark"
                                    />
                                </EuiFlexItem>
                                <EuiFlexItem grow={false} style={{ flexBasis: "fit-content" }}>
                                    <EuiButtonIcon
                                        onClick={logout}
                                        iconType="lock"
                                        display="fill"
                                        size="s"
                                        aria-label="logout-button"
                                    />
                                </EuiFlexItem>
                            </EuiFlexGroup>
                        </EuiHeaderSectionItem>
                    </EuiFlexItem>
                </EuiFlexGroup>
            </EuiHeader>
    )
}
export default Header;