import {
    EuiBadge,
    EuiBasicTable,
    EuiButtonIcon,
    EuiCopy,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
} from "@elastic/eui";
import { useEffect, useState, useCallback } from "react";
import { getDocs, query, where } from "firebase/firestore";
import Header from "../component/Header";
import { MeetingType } from "../utils/types";
import moment from "moment";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import useAuth from "../hooks/useAuth";
import { meetingsRef } from "../utils/firebaseConfig";
import EditFlyout from "../component/EditFlyout";
function MyMeeting() {
    useAuth();

    const userInfo = useAppSelector((zoom) => zoom.auth.userInfo);
    const [meetings, setMeetings] = useState<Array<MeetingType>>([]);
    const [showEditFlyout, setShowEditFlyout] = useState(false);
    const [editMeeting, setEditMeeting] = useState<MeetingType>();
    const closeEditFlyout = (dataChanged = false) => {
        setShowEditFlyout(false);
        setEditMeeting(undefined);
        if (dataChanged) getMyMeetings();
    };
    const openEditFlyout = (meeting: MeetingType) => {
        setShowEditFlyout(true);
        setEditMeeting(meeting);
    };
    const getMyMeetings = useCallback(async () => {
        const firestoreQuery = query(
            meetingsRef,
            where("createdBy", "==", userInfo?.uid)
        );
        const fetchedMeetings = await getDocs(firestoreQuery);
        if (fetchedMeetings.docs.length) {
            const myMeetings: Array<MeetingType> = [];
            fetchedMeetings.forEach((meeting) => {
                myMeetings.push({
                    docId: meeting.id,
                    ...(meeting.data() as MeetingType),
                });
            });
            setMeetings(myMeetings);
        }
    }, [userInfo?.uid]);
    
    useEffect(() => {
        if (userInfo) getMyMeetings();
    }, [userInfo, getMyMeetings]);
    const meetingColumns = [
        {
            field: "meetingName",
            name: "Meeting Name"
        },
        {
            field: "meetingType",
            name: "Meeting Type",
        },
        {
            field: "meetingDate",
            name: "Meeting Date",
        },
        {
            field: "",
            name: "Status",

            render: (meeting: any) => {
                if (meeting.status) {
                    if (meeting.meetingDate === moment().format("L")) {
                        return (
                            <EuiBadge color="success">
                                <Link to={`/join/${meeting.meetingId}`} style={{ color: "black" }}>Join Now</Link>
                            </EuiBadge>
                        )
                    }
                    else if (moment(meeting.meetingDate).isBefore(moment().format("L"))) {
                        return <EuiBadge color="default">Ended</EuiBadge>;
                    }
                    else if (moment(meeting.meetingDate).isAfter()) {
                        return <EuiBadge color="primary">Upcoming</EuiBadge>;
                    }
                }
                else return <EuiBadge color="danger">Cancelled</EuiBadge>;
            }
        },
        {
            field: "",
            name: "Edit",
            width: "5%",
            render: (meeting: MeetingType) => {
                return (
                    <EuiButtonIcon
                        aria-label="meeting-edit"
                        iconType="indexEdit"
                        color="danger"
                        display="base"
                        isDisabled={
                            moment(meeting.meetingDate).isBefore(moment().format("L")) ||
                            !meeting.status
                        }
                        onClick={() => openEditFlyout(meeting)}
                    />
                );
            },
        },
        {
            field: "meetingId",
            name: "Copy Link",
            width: "10%",
            render: (meetingId: any) => {
                return (<EuiCopy
                    textToCopy={`http://localhost:3000/join/${meetingId}`}
                >
                    {(copy) => (
                        <EuiButtonIcon
                            iconType="copy"
                            onClick={copy}
                            display="base"
                            aria-label="meeting-copy"
                        />
                    )}
                </EuiCopy>)
            }
        }
    ]
    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                flexDirection: "column",
            }}
        >
            <Header></Header>
            <EuiFlexGroup justifyContent="center" style={{ margin: "1rem" }}>
                <EuiFlexItem>
                    <EuiPanel>
                        <EuiBasicTable items={meetings} columns={meetingColumns} />
                    </EuiPanel>
                </EuiFlexItem>
            </EuiFlexGroup>
            {showEditFlyout && (
        <EditFlyout closeFlyout={closeEditFlyout} meeting={editMeeting!} />
      )}
        </div>
    )
}
export default MyMeeting;