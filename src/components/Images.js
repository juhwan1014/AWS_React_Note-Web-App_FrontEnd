import React, { useState, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import config from '../aws-exports';
import { RiCloseCircleFill } from 'react-icons/ri';
import * as IoIcons from 'react-icons/io';
import { IconContext } from "react-icons";
import '../Styles/images.css';
import { Auth } from 'aws-amplify'

export default function Images() {
  const API_INVOKE_URL = 'https://bczaq9pxqi.execute-api.us-east-1.amazonaws.com/prod'

  const [file, setFile] = useState();
  const [uploaded, setUploaded] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [selectedIndex, setSelectedIndex] = useState([])
  const [pics, setPics] = useState([]);
  const [pic, setPic] = useState({});
  const [USER_ID, setUSER_ID] = useState("");

  async function checkUser() {
    let user = await Auth.currentAuthenticatedUser();
    setUSER_ID(user.username)
  }
  checkUser()

  const searchApi = async () => {
    fetch(API_INVOKE_URL + '/gallery')
      .then(response => response.json())
      .then(data => {
        setPics(JSON.parse(data.body));
      }
      )
  }
  useEffect(() => {
    searchApi();
  }, [])


  const putFile = async () => {
    const storageResult = await Storage.put(`${Date.now() + file.name}`, file, {
      level: 'public',
      contentType: 'image/jpg'
    })
    setUploaded(true);
    setImageSrc(`https://${config.aws_user_files_s3_bucket}.s3.amazonaws.com/public/${storageResult.key}`);
  }


  const submit = e => {
    const exisingItems = [pics.find(i => i.id == pic.id).image].flat()

    e.preventDefault()
    fetch(API_INVOKE_URL + '/gallery', {
      method: 'PUT',
      body: JSON.stringify({
        list: {
          ...pic,
          image: [...exisingItems, imageSrc]
        }
      }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(() => { searchApi() })

    setUploaded(false)

  }

  const deleteList = e => {

    const exisingItems = [pics.find(i => i.id == pic.id).image].flat()

    exisingItems.splice(selectedIndex[selectedIndex.length - 1], 1)

    e.preventDefault()

    fetch(API_INVOKE_URL + '/gallery', {
      method: 'DELETE',
      body: JSON.stringify({
        list: {
          ...pic,
          image: exisingItems
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(() => { searchApi() })

  }


  function imageIndex(index, imageList) {
    setPic({ ...pic, id: imageList.id, image: imageList.image })
    selectedIndex.push(index)
  }

  const newLists = pics.find(i => i.image[0] == USER_ID)

  function bringObject(picList, USER_ID) {
    if (picList == newLists) {
      USER_ID = picList.id
    }
    else {
      return (null)
    }
  }

  return (
    <div class="ImgContainer">
      <h2>Ninja Image Gallery</h2>
      <div class="row imageContainer">
        <div className='pictureBOX'>
          <IconContext.Provider
            value={{ color: 'white', size: '50px', className: 'galleryIcon' }}>
            <IoIcons.IoMdImages />
          </IconContext.Provider>
          <input className='chooseFileImage' accept="image/*" multiple type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>


        <div className="uploadAndSave">
          <button className='uploadButtonImage' onClick={putFile} >Upload</button>

          {uploaded
            ?
            <form onSubmit={submit} className="PictureSaveForm">
              <p>Would you like to save the picture?</p>
              <button
                className='uploadButtonImage'
                type="submit"
                name="list[image]"
                onClick={e => setPic({ ...pic, image: imageSrc, id: USER_ID })} >
                SAVE </button>
            </form>
            : console.log("No Image Yet!")
          }

        </div>


      





        <div className="imgCons">
          <table className="IMAGEtable" >
            <tbody >



              {pics.map(picList =>
                <tr key={picList.id} className="pictureTR"  >

                  {bringObject(picList, USER_ID)}

                  {picList.id == USER_ID ? picList.image.filter((x, index) => index > 0).map((picture, index) => (

                      <td className="pictureTD">
                        <div className="picNbtn" style={{ display: "flex", flexDirection: "row" }}>
                         
                          <img  className="pictures" src={picture} />
                       
                          <form onSubmit={deleteList}>
                            <button type="submit"
                              className="deleteButtonImage" onClick={e => imageIndex(index + 1, picList)}>
                              <RiCloseCircleFill size={25} /></button>
                        
                            
                          </form>

                        

                        </div>

               
                      </td>

            
                  )) : console.log("Error")}
                
                </tr>
              
              )}
            </tbody>
          </table>
        </div>
      
        </div>

    </div>
  );
}