import {
    EuiBadge,
    EuiBasicTable,
    EuiButtonIcon,
    EuiCopy,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
} from "@elastic/eui";
import Header from "../component/Header";
import { Link } from "react-router-dom";
import moment from "moment";
import useAuth from "../hooks/useAuth";
import { useAppSelector } from "../app/hooks";
import React, { useEffect, useState } from "react";
import { getDocs,query } from "firebase/firestore";

import { meetingsRef } from "../utils/firebaseConfig";

function Meeting() {
    useAuth();
    const userInfo = useAppSelector((zoom) => zoom.auth.userInfo);
    const [meetings, setMeetings] = useState([]);
    useEffect(()=>{
        const getMyMeetings=async ()=>{
            const firestoreQuery = query(meetingsRef);
            const fetchedMeetings = await getDocs(firestoreQuery);
            if(fetchedMeetings.docs.length){
                const myMeetings=[];
                fetchedMeetings.forEach((meeting) => {
                    const data = meeting.data();
                    if (data.createdBy === userInfo?.uid)
                      myMeetings.push(meeting.data() );
                    else if (data.meetingType === "anyone-can-join")
                      myMeetings.push(meeting.data());
                    else {
                      const index = data.invitedUsers.findIndex(
                        (user) => user === userInfo?.uid
                      );
                      if (index !== -1) {
                        myMeetings.push(meeting.data());
                      }
                    }
                });
                setMeetings(myMeetings);
            }
        }
        if (userInfo) getMyMeetings();
    },[userInfo])

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

            render: (meeting) => {
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
            field: "meetingId",
            name: "Copy Link",
            width:"10%",
            render: (meetingId) => {
                return(<EuiCopy
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
        </div>
    )
}
export default Meeting;