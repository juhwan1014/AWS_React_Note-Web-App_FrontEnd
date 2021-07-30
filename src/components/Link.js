import React, { useState, useEffect } from 'react'
import { GoFileSymlinkFile } from 'react-icons/go'
import { RiCloseCircleFill } from 'react-icons/ri';
import { Auth } from 'aws-amplify'
import '../Styles/Link.css'

export default function Link() {

    const API_INVOKE_URL = 'https://bczaq9pxqi.execute-api.us-east-1.amazonaws.com/prod'
    const [urls, setUrls] = useState([])
    const [url, setUrl] = useState({})
    const [selectedIndex, setSelectedIndex] = useState([])
    const [USER_ID, setUSER_ID] = useState("")

    async function checkUser() {
        let user = await Auth.currentAuthenticatedUser();
        setUSER_ID(user.username)
    }
    checkUser()

    const searchApi = async () => {
        fetch(API_INVOKE_URL + '/link')
            .then(response => response.json())
            .then(data => {
                setUrls(JSON.parse(data.body));
            }
            )
    }
    useEffect(() => {
        searchApi();
    }, [])


    const submit = e => {
        const exisingItems = [urls.find(i => i.id == url.id).link].flat()

        const exisingItems2 = [urls.find(i => i.id == url.id).linkTitle].flat()

        console.log(url)
        e.preventDefault()
        fetch(API_INVOKE_URL + '/link', {
            method: 'PUT',
            body: JSON.stringify({
                list: {
                    ...url,
                    link: [...exisingItems, url.link],
                    linkTitle: [...exisingItems2, url.linkTitle]
                }
            }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(() => { searchApi() })
        e.target.reset()
    }

    const deleteList = e => {
        const exisingItems = [urls.find(i => i.id == url.id).link].flat()

        const exisingItems2 = [urls.find(i => i.id == url.id).linkTitle].flat()

        exisingItems.splice(selectedIndex[selectedIndex.length - 1], 1)

        exisingItems2.splice(selectedIndex[selectedIndex.length - 1], 1)

        e.preventDefault()
        fetch(API_INVOKE_URL + '/link', {
            method: 'DELETE',
            body: JSON.stringify({
                list: {
                    ...url,
                    link: exisingItems,
                    linkTitle: exisingItems2
                }
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(() => { searchApi() })

    }

    function LinkIndex(index, linkList) {
        setUrl({ ...url, id: linkList.id, link: linkList.link })
        selectedIndex.push(index)
    }

    function colorChange(index) {
        if (index > 4) {
            index = index - 5
        }
        var color = ["red", "orange", "yellow", "green", "blue"];
        return (color[index])
    }

    const newLists = urls.find(i => i.link[0] == USER_ID)

    function bringObject(linkList, USER_ID) {
        if (linkList == newLists) {
            USER_ID = linkList.id
        }
        else {
            return (null)
        }
    }

    return (
        <div>
            <h2>Ninja Create List Link</h2>
            <table className="linkTable">
                <tbody>
                    {urls.map(linkList =>

                        <tr className="linkTR" key={linkList.id}>

                            {bringObject(linkList, USER_ID)}

                            {linkList.id == USER_ID ? linkList.link.filter((x, index) => index > 0).map(
                                (contents, index) => (
                                    <td valign="top" className="linkbox" >
                                        <tr valign="left" className="linkwithtitle">

                                            <a href={contents} rel="noopener noreferrer" target="_blank">   <GoFileSymlinkFile size={70} className="d-flex" color={colorChange(index)} /></a>

                                            <p className="urlTitle">{linkList.linkTitle[index + 1]}</p>
                                        </tr>
                                        <form onSubmit={deleteList} className="deleteSectionLink">
                                            <button type="submit"
                                                className="deleteButtonLink" onClick={e => LinkIndex(index + 1, linkList)}>
                                                <RiCloseCircleFill size={25} /></button>
                                        </form>
                                    </td>
                                )
                            ) : console.log("Couldn't find User")}
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="inputFormLink">
                <form onSubmit={submit} className="putSection" >
                    <input
                        type="text"
                        name="urltitle"
                        className="URLTitle"
                        placeHolder="Name of website"
                        maxLength="20"
                        onChange={e => setUrl({ ...url, linkTitle: JSON.parse(JSON.stringify(e.target.value)) })} required />
                    <br />
                    <input
                        type="text"
                        name="list[todo]"
                        className="linkInputBox"
                        placeholder="URL here"
                        onChange={e => setUrl({ ...url, link: JSON.parse(JSON.stringify(e.target.value)), id: USER_ID })} required />
                    <br />
                    <input type="submit" name="Create Link" className="createButton" value="Create" />
                </form>
            </div>
        </div >
    )
}
