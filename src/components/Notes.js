import React, { useState, useEffect } from 'react'
import '../Styles/Notes.css'
import { Auth } from 'aws-amplify'
import { Form, Button } from 'react-bootstrap'
import { RiCloseCircleLine } from 'react-icons/ri';


export default function Notes() {

    const API_INVOKE_URL = 'https://bczaq9pxqi.execute-api.us-east-1.amazonaws.com/prod'
    const [memos, setMemos] = useState([])
    const [memo, setMemo] = useState({})
    const [selectedIndex, setSelectedIndex] = useState([])
    const [USER_ID, setUSER_ID] = useState("")

    async function checkUser() {
        let user = await Auth.currentAuthenticatedUser();
        setUSER_ID(user.username)
    }
    checkUser()

    const searchApi = async () => {
        fetch(API_INVOKE_URL + '/notes')
            .then(response => response.json())
            .then(data => {
                setMemos(JSON.parse(data.body));
            }
            )
    }
    useEffect(() => {
        searchApi();
    }, [])

    const submit = e => {
        const exisingItems = [memos.find(i => i.id == memo.id).notes].flat()

        e.preventDefault()
        fetch(API_INVOKE_URL + '/notes', {
            method: 'PUT',
            body: JSON.stringify({
                list: {
                    ...memo,
                    notes: [...exisingItems, memo.notes]
                }
            }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(() => { searchApi() })

        e.target.reset()
    }

    const deleteList = e => {
        const exisingItems = [memos.find(i => i.id == memo.id).notes].flat()

        exisingItems.splice(selectedIndex[selectedIndex.length - 1], 1)

        e.preventDefault()
        fetch(API_INVOKE_URL + '/notes', {
            method: 'DELETE',
            body: JSON.stringify({
                list: {
                    ...memo,
                    notes: exisingItems
                }
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(() => { searchApi() })
    }

    function noteIndex(index, noteList) {
        setMemo({ ...memo, id: noteList.id, notes: noteList.notes })
        selectedIndex.push(index)
    }

    const newLists = memos.find(i => i.notes[0] == USER_ID)

    function bringObject(noteList, USER_ID) {
        if (noteList == newLists) {
            USER_ID = noteList.id
        }
        else {
            return (null)
        }
    }

    return (
        <div class="container">
            <h2 className="notesHeader">Ninja Notes List</h2>
            <div class="row">
                <div className='noteBody'>
                    <div className='noteBody'>

                        {memos.map(noteList =>
                            <tr key={noteList.id}>

                                {bringObject(noteList, USER_ID)}

                                {noteList.id == USER_ID ? noteList.notes.filter((x, index) => index > 0).map((contents, index) => (
                                    <div className="formbox">
                                        <form onSubmit={deleteList} className="deleteSection">

                                            <td className="noteContents" >{contents}</td>

                                            <button type="submit"
                                                className="deleteButtonNote" onClick={e => noteIndex(index + 1, noteList)}>
                                                <RiCloseCircleLine /></button>
                                        </form>
                                    </div>
                                )) : console.log("couldn't find User")}
                            </tr>
                        )}
                    </div>
                </div>
                <div className="noteLastDiv">
                    <form onSubmit={submit} className="putSectionNotes" >

                        <Form.Group controlId="exampleForm.ControlTextarea1" className="textBox" >
                            <Form.Control as="textarea" className="notesPage" rows={15}
                                placeholder="Write text here..."
                                onChange={e => setMemo({ ...memo, notes: JSON.parse(JSON.stringify(e.target.value)), id: USER_ID })} />
                            <Button className="saveButton" type="submit" >SAVE</Button>
                        </Form.Group>
                    </form>
                </div>
            </div>
        </div>
    )
}

