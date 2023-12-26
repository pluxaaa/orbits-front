import { FC, useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Orbit } from '../../modules/ds';
import store from '../../store/store';
import { getOrbitByName } from '../../modules/getOrbitByName';
import { editOrbit } from '../../modules/editOrbit';
import { addNewOrbit } from '../../modules/addNewOrbit';
import { uploadOrbitImage } from '../../modules/uploadOrbitImage';
import { ToastContainer, toast } from 'react-toastify';
import "./OrbitForm.styles.css"
import "react-toastify/dist/ReactToastify.css";

const OrbitForm: FC = () => {
    const navigate = useNavigate();
    const { orbit_name } = useParams();
    const [orbit, setOrbit] = useState<Orbit | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const { userToken } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);

    useEffect(() => {
        if (orbit_name && orbit_name !== 'add') {
            localStorage.setItem("flag", "edit")
            getOrbitByName(orbit_name)
                .then((response) => setOrbit(response))
                .catch((error) => console.error('Ошибка при получении данных об орбите:', error));
        } else {
            setOrbit({
                Name: '',
                Apogee: '',
                Perigee: '',
                Inclination: '',
                Description: '',
                ID: 0,
                ImageURL: '',
                IsAvailable: false
            });
            localStorage.setItem("flag", "add")
        }
        return () => {
            localStorage.removeItem('flag');
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.type === 'file') {
            const file = e.target.files && e.target.files[0];
            if (file) {
                setImageFile(file);
            }
        } else {
            setOrbit((prevOrbit) => ({
                ...prevOrbit!,
                [e.target.name]: e.target.value,
            }));
        }
    };

    const handleImageUpload = async () => {
        try {
            if (imageFile) {
                const imageUrl = await uploadOrbitImage(userToken?.toString(), imageFile, orbit?.Name);
                setOrbit((prevOrbit) => ({
                    ...prevOrbit!,
                    ImageURL: imageUrl,
                }));
            }
        } catch (error) {
            console.error('Ошибка при загрузке изображения:', error);
            toast.error('Ошибка при загрузке изображения', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
                closeButton: false,
                hideProgressBar: true,
            });
        }
    };
        

    const handleOrbitSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (orbit) {
                if (orbit_name && localStorage.getItem("flag") == "edit") {
                    const updatedOrbit = await editOrbit(userToken?.toString(), orbit);
                    setOrbit(updatedOrbit);
                    navigate(`/orbits/${updatedOrbit.Name}/edit`);
                } else {
                    const newOrbit = await addNewOrbit(userToken?.toString(), orbit);
                    setOrbit(newOrbit);
                    localStorage.setItem("flag", "edit")
                    navigate(`/orbits/${newOrbit.Name}/edit`);
                }
                await handleImageUpload();
            }
        } catch (error) {
            console.error('Ошибка при сохранении орбиты:', error);
            toast.error('Ошибка при сохранении орбиты', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
                closeButton: false,
                hideProgressBar: true,
            });
        }
    };

    return (
        <div className="form-container">
            <ToastContainer />
            <Form onSubmit={handleOrbitSubmit} encType="multipart/form-data">
                <Form.Group controlId="formOrbitImage">
                    <Form.Control
                        type="file"
                        name="image"
                        onChange={handleChange}
                    />
                    {orbit?.ImageURL && (
                        <img
                            src={orbit.ImageURL}
                            alt={`Orbit ${orbit.Name} Image`}
                            style={{ maxWidth: '40%', marginBottom: '10px' }}
                        />
                    )}
                </Form.Group>
                <Form.Group controlId="formOrbitName">
                    <Form.Label>Название орбиты</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите название"
                        name="Name"
                        value={orbit?.Name || ''}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formOrbitApogee">
                    <Form.Label>Апогей</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите апогей"
                        name="Apogee"
                        value={orbit?.Apogee || ''}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="formOrbitPerigee">
                    <Form.Label>Перигей</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите перигей"
                        name="Perigee"
                        value={orbit?.Perigee || ''}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="formOrbitIncl">
                    <Form.Label>Наклонение</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите наклонение"
                        name="Inclination"
                        value={orbit?.Inclination || ''}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="formOrbitDesc">
                    <Form.Label>Описание</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите описание"
                        name="Description"
                        value={orbit?.Description || ''}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Button className='button' type="submit">
                    {orbit_name && orbit_name !== 'add' ? 'Сохранить изменения' : 'Добавить орбиту'}
                </Button>
            </Form>
        </div>
    );
};

export default OrbitForm