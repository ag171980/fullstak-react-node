import axios from "axios";
import { useState } from "react";
import Post from "../../components/Post/Post";
import { Button, Modal, Form } from 'react-bootstrap'
import Header from "../../components/Header/Header";
import Profile from '../../assets/profile.jpg'

const Home = () => {
    let datta = JSON.parse(localStorage.getItem("userLogged"))

    const [posts, setPosts] = useState([]);
    const [statePosts, setStatePosts] = useState(false);
    const [user, setUser] = useState(datta)
    const [selectedImage, setSelectedImage] = useState(null);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const obtenerNick = async (idUsuario) => {
        const nickname = await axios.get(`http://localhost:8000/.netlify/functions/api/users/${idUsuario}`)
        return nickname.data.nick_usuario
    }

    const obtenerPosts = async () => {
        try {
            let response = await axios.get(`http://localhost:8000/.netlify/functions/api/posts/${datta.id}`)

            if (response.status === 200) {
                let nick = await obtenerNick(response.data[0].id_user)



                setPosts([])
                setStatePosts(true)
                response.data.forEach(element => {
                    element.nick = nick
                    setPosts(posts => [...posts, element])
                });
                return true;
            }
            return false;
        } catch (err) {
            console.error(err)
            return false;
        }
    }
    const crearPost = async (e) => {
        e.preventDefault();
        var todayDate = new Date().toISOString().slice(0, 10);
        let data = {
            id_user: datta.id,
            titulo_post: document.querySelector("#titulo_post").value,
            descripcion_post: document.querySelector("#descripcion_post").value,
            imagen_post: selectedImage,
            createdAt: todayDate,
            updatedAt: todayDate
        }

        await axios.post("http://localhost:8000/.netlify/functions/api/crearPost", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
            .then((res) => {
                // console.log(res.data)
                obtenerPosts()
                // setTimeout(() => {
                //     if (res.status === 200 && !res.data.message) {
                //         document.querySelector(".loading").innerHTML = `
                //     <div className="message-response">
                //         <p>Iniciaste sesion correctamente!</p>
                //     </div>
                //     `

                //         localStorage.setItem("userLogged", JSON.stringify(res.data))
                //     } else {
                //         document.querySelector(".loading").innerHTML = `
                //     <div className="message-response">
                //         <p>${res.data.message}</p>
                //     </div>
                //     `
                //     }
                //     setTimeout(() => {
                //         document.querySelector(".loading").classList.remove("show")
                //         window.location.href = "/home"
                //     }, 2000);
                // }, 2000);
            })
            .catch((err) => {
                console.error(err)
            })

    }

    if (!statePosts) {
        obtenerPosts()
    }
    return (
        <div className="Home">
            {/* <Header /> */}
            {/* <h1>Bienvenido !</h1>
            <hr />
            <Button variant="primary" onClick={handleShow}>
                Crear Post
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Crea tu propio Post!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={crearPost} encType="multipart/form-data">
                        <Form.Group className="mb-3" controlId="titulo_post">
                            <Form.Label>Titulo</Form.Label>
                            <Form.Control type="text" placeholder="Mi primer post..." />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="descripcion_post">
                            <Form.Label>Descripcion</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                        <Form.Group controlId="imagenes_post" className="mb-3">
                            <Form.Label>Imagenes</Form.Label>
                            <Form.Control type="file" name="imagenes_post" multiple onChange={(event) => {
                                setSelectedImage(event.target.files[0]);
                            }} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Crear
                        </Button>
                    </Form>
                </Modal.Body>

            </Modal>
            <hr />
            <h2>Estos son tus posts:</h2> */}


            <div className="sidebar">
                <div className="logo">
                    <h1>SocialApp</h1>
                </div>
                <div className="navigate-social">
                    <div className="link">
                        <a>Feed</a>
                    </div>
                    <div className="link">
                        <a>Messages</a>
                    </div>
                    <div className="link">
                        <a>Friends</a>
                    </div>
                    <div className="link">
                        <a>My Profile</a>
                    </div>
                    <div className="link">
                        <a>Logout</a>
                    </div>
                    <div className="link">
                        <a>New Post</a>
                    </div>
                </div>

            </div>
            <div className="feed">
                <div className="posts">
                    {posts.map((post, index) => <Post post={post} key={index} />)}
                </div>

            </div>
            <div className="profile-suggestions">
                <div className="my-profile">
                    <img src={Profile} height="70" style={{ borderRadius: "50px" }} />
                    <div className="data-profile">
                        <h2>my nickname</h2>
                        <p>my name</p>
                    </div>
                </div>
                <div className="suggestions">
                    <div className="profile-suggest">
                        <img src={Profile} height="70" style={{ borderRadius: "50px" }} />
                        <div className="data-profile">
                            <h3>my nickname</h3>
                            <p>my name</p>
                        </div>
                    </div>
                    <div className="profile-suggest">
                        <img src={Profile} height="70" style={{ borderRadius: "50px" }} />
                        <div className="data-profile">
                            <h3>my nickname</h3>
                            <p>my name</p>
                        </div>
                    </div>
                    <div className="profile-suggest">
                        <img src={Profile} height="70" style={{ borderRadius: "50px" }} />
                        <div className="data-profile">
                            <h3>my nickname</h3>
                            <p>my name</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Home;