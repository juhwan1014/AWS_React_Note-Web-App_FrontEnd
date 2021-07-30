import React, { useState, useEffect } from 'react';
import "../Styles/Todo.css";
import { inputLabel } from 'aws-amplify';
import { LinkContainer } from 'react-router-bootstrap';
import { Auth } from 'aws-amplify'

export default function Todo() {

    const API_INVOKE_URL = 'https://bczaq9pxqi.execute-api.us-east-1.amazonaws.com/prod'
    const [lists, setLists] = useState([])
    const [list, setList] = useState({})
    const [selectedIndex, setSelectedIndex] = useState([])
    const [USER_ID, setUSER_ID] = useState("")

    async function checkUser() {
        let user = await Auth.currentAuthenticatedUser();
        setUSER_ID(user.username)
    }
    checkUser()

    const searchApi = async () => {
        fetch(API_INVOKE_URL + '/Ninja')
            .then(response => response.json())
            .then(data => {
                setLists(JSON.parse(data.body));
            }
            )
    }
    useEffect(() => {
        searchApi();
    }, [])

    const submit = e => {
        const exisingItems = [lists.find(i => i.id == list.id).todo].flat()

        e.preventDefault()
        fetch(API_INVOKE_URL + '/Ninja', {
            method: 'PUT',
            body: JSON.stringify({
                list: {
                    ...list,
                    todo: [...exisingItems, list.todo]
                }
            }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(() => { searchApi() })
        e.target.reset()
    }

    const deleteList = e => {
        const exisingItems = [lists.find(i => i.id == list.id).todo].flat()

        selectedIndex.sort(function (a, b) {
            return a - b;
        });

        for (var i = 0; i < selectedIndex.length; i++) {
            exisingItems.splice(selectedIndex[i] - i, 1)
        }

        e.preventDefault()
        fetch(API_INVOKE_URL + '/Ninja', {
            method: 'DELETE',
            body: JSON.stringify({
                list: {
                    ...list,
                    todo: exisingItems
                }
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(() => { searchApi() })

        for (var i = selectedIndex.length; i > 0; i--) {
            selectedIndex.pop();
        }
    }

    function checkedList(index, TODOlist) {
        setList({ ...list, id: TODOlist.id, todo: TODOlist.todo })

        if (selectedIndex.includes(index) === false) {
            selectedIndex.splice(selectedIndex.length, 0, index)
        }
        else {
            selectedIndex.splice(selectedIndex.indexOf(index), 1)
        }
    }

    const newLists = lists.find(i => i.todo[0] == USER_ID)

    function bringObject(TODOlist, USER_ID) {
        if (TODOlist == newLists) {
            USER_ID = TODOlist.id
        }
        else {
            return (null)
        }
    }

    return (
        <div>
            <h2>Ninja Todo Lists</h2>
            <table className="todoTable">
                <thead>
                    <tr>
                        <th>To-Do Items</th>
                    </tr>
                </thead>
                <tbody>

                    {lists.map(TODOlist =>
                        <tr key={TODOlist.id}>

                            {bringObject(TODOlist, USER_ID)}

                            {TODOlist.id == USER_ID ? TODOlist.todo.filter((x, index) => index > 0).map((text, index) => (
                                <div key={TODOlist.userName + index + text} >
                                    <td>
                                        <input type="checkbox" onChange={e => checkedList(index + 1, TODOlist)} className="checkedBox" />
                                        <label className="checkedLabel">{text}</label>
                                    </td>
                                </div>
                            )) : console.log("Couldn't find User")}
                        </tr>
                    )}
                </tbody>
            </table>

            <form onSubmit={deleteList} className="deleteSection">
                <input type="submit" name="Delete List" className="deleteButton" value="Delete" />
            </form>
            <div className="inputFormTodo">
                <form onSubmit={submit} className="putSection" >

                    <input
                        id="stringInput"
                        type="text"
                        name="list[todo]"
                        className="todoInputBox"
                        maxLength="45"
                        placeholder="Type things to do"
                        maxLength="45"
                        onChange={e => setList({ ...list, todo: JSON.parse(JSON.stringify(e.target.value)), id: USER_ID })} required />
                    <br />
                    <input type="submit" name="Create List" className="createButton" value="Create" />
                </form>
            </div>
        </div >
    )
}


