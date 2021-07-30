import React, { useState, useEffect } from 'react';
import { Auth } from "aws-amplify";
import "../Styles/Profile.css";
import "react-datepicker/dist/react-datepicker.css";


export default function Profile() {
    const API_INVOKE_URL = 'https://bczaq9pxqi.execute-api.us-east-1.amazonaws.com/prod'

    const [pros, setPros] = useState([])
    const [pro, setPro] = useState({})
    const [inputText, setInputText] = useState("");


    const [dob, setDob] = useState("");
    const [ph, setPhone] = useState("");
    const [nick, setNick] = useState("");
    const [gd, setGender] = useState("");


    const [USER_ID, setUSER_ID] = useState("");
    const [USER_EMAIL, setUSER_EMAIL] = useState("");
    const [edit, setEdit] = useState(false)


    async function checkUser() {
        let user = await Auth.currentAuthenticatedUser();
        setUSER_EMAIL(user.attributes.email)
        setUSER_ID(user.username)
    }
    checkUser()

    const searchApi = async () => {

        fetch(API_INVOKE_URL + '/profile')
            .then(response => response.json())
            .then(data => {
                setPros(JSON.parse(data.body));
            }
            )
    }
    useEffect(() => {
        searchApi();
    }, [])


    const submit = e => {

        const exisingItems = [pros.find(i => i.id == pro.id).DOB].flat()
        exisingItems.splice(1, 1)
        const exisingItems2 = [pros.find(i => i.id == pro.id).phone].flat()
        exisingItems2.splice(1, 1)
        const exisingItems3 = [pros.find(i => i.id == pro.id).Nickname].flat()
        exisingItems3.splice(1, 1)
        const exisingItems4 = [pros.find(i => i.id == pro.id).gender].flat()
        exisingItems4.splice(1, 1)

        e.preventDefault()
        fetch(API_INVOKE_URL + '/profile', {
            method: 'PUT',
            body: JSON.stringify({
                list: {
                    ...pro,
                    DOB: [...exisingItems, dob],
                    phone: [...exisingItems2, ph],
                    Nickname: [...exisingItems3, nick],
                    gender: [...exisingItems4, gd]
                }
            }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(() => { searchApi() })
        e.target.reset()
        resetEdit()
    }

    const newLists = pros.find(i => i.DOB[0] == USER_ID)

    function bringObject(prolist, USER_ID) {
        if (prolist == newLists) {
            USER_ID = prolist.id
        }
        else {
            return (null)
        }
    }

    const onChangeDob = e => {
        setDob("")
        setDob(e.target.value)
    };

    useEffect(() => {
        setPro({ ...pro, DOB: dob, id: USER_ID });
    }, [dob]);

    const onChangePhone = e => {
        setPhone("")
        setPhone(e.target.value)
    };

    useEffect(() => {
        setPro({ ...pro, phone: ph, id: USER_ID });
    }, [ph]);

    const onChangeNick = e => {
        setNick("")
        setNick(e.target.value)
    };

    useEffect(() => {
        setPro({ ...pro, Nickname: nick, id: USER_ID });
    }, [nick]);

    const onChangeGender = e => {
        setGender("")
        setGender(e.target.value)
    };
    useEffect(() => {
        setPro({ ...pro, gender: gd, id: USER_ID });
    }, [gd]);

    const startEdit = () => {
        if (edit == false) {
            setDob(newLists.DOB[1])
            setPhone(newLists.phone[1])
            setNick(newLists.Nickname[1])
            setGender(newLists.gender[1])

            setEdit(true)
        }
        else
            setEdit(false)
    }

    const resetEdit = () => {
        setEdit(false)
    }

    return (
        <div>
            <table className="profileTable">
                <thead>
                    <tr>
                        <th>My Profile</th>
                    </tr>
                </thead>
                <tbody>
                    {pros.map(prolist =>
                        <tr key={prolist.id}>

                            {bringObject(prolist, USER_ID)}

                            {prolist.id == USER_ID ? prolist.DOB.filter((x, index) => index > 0).map((text, index) => (
                                <div key={prolist.userName + index + text} >

                                    <label className="profileEmailItem"><div className="proTitle">Email:</div>{USER_EMAIL} </label>

                                    <td className="DOBtd">

                                        <label className="profileItem"><div className="proTitle">Date of Birth:</div>{edit == true ? <input
                                            type="date"
                                            value={dob}
                                            placeholder="enter here"
                                            onChange={onChangeDob}
                                        /> : text}</label>

                                    </td>
                                </div>
                            )) : console.log("Couldn't find User")}

                            {prolist.id == USER_ID ? prolist.phone.filter((x, index) => index > 0).map((text, index) => (
                                <div key={prolist.userName + index + text} >
                                    <td>

                                        <label className="profileItem"><div className="proTitle">Phone:</div>{edit == true ? <input
                                            type="number"
                                            value={ph}
                                            placeholder="enter here"
                                            onChange={onChangePhone}
                                        /> : text}</label>

                                    </td>
                                </div>
                            )) : console.log("Couldn't find User")}

                            {prolist.id == USER_ID ? prolist.Nickname.filter((x, index) => index > 0).map((text, index) => (
                                <div key={prolist.userName + index + text} >
                                    <td>

                                        <label className="profileItem"><div className="proTitle">NickName:</div>{edit == true ? <input
                                            type="text"
                                            value={nick}
                                            placeholder="enter here"
                                            onChange={onChangeNick}
                                        /> : text}</label>

                                    </td>
                                </div>
                            )) : console.log("Couldn't find User")}

                            {prolist.id == USER_ID ? prolist.gender.filter((x, index) => index > 0).map((text, index) => (
                                <div key={prolist.userName + index + text} >
                                    <td >

                                        <label className="profileGenderItem"><div className="proTitle">Gender:</div> {edit == true ? <input
                                            type="text"
                                            value={gd}
                                            placeholder="enter here"
                                            onChange={onChangeGender}
                                        /> : text}  </label>

                                    </td>

                                </div>
                            )) : console.log("Couldn't find User")}

                        </tr>

                    )}
                    <div className="profileButtons">
                        <button className="ProfileEdit" onClick={startEdit}>EDIT</button>
                        <form onSubmit={submit}  >
                            <input type="submit" name="Create Link" className="profileCreateButton" value="SAVE"
                            />
                        </form>
                    </div>
                </tbody>
            </table>
        </div >
    )
}
