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

const OrbitForm: FC = () => {
    const navigate = useNavigate();
    const { orbit_name } = useParams();
    const [orbit, setOrbit] = useState<Orbit | null>(null);
    const [orbitAdd, setOrbitAdd] = useState<string | null>();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const { userToken } = useSelector((state: ReturnType<typeof store.getState>) => state.auth);

    useEffect(() => {
        if (orbit_name && orbit_name !== 'add') {
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
            setOrbitAdd("add");
        }
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
                const imageUrl = await uploadOrbitImage(userToken?.toString(), imageFile);
                setOrbit((prevOrbit) => ({
                    ...prevOrbit!,
                    ImageURL: imageUrl,
                }));
                console.log("new image: ", imageUrl);
                console.log("orbit image: ", orbit?.ImageURL);
            }
        } catch (error) {
            console.error('Ошибка при загрузке изображения:', error);
        }
    };

    const handleOrbitSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await handleImageUpload();

            if (orbit) {
                if (orbit_name && orbit_name !== orbitAdd) {
                    console.log("orbit image add: ", orbit?.ImageURL);
                    const updatedOrbit = await editOrbit(userToken?.toString(), orbit);
                    setOrbit(updatedOrbit);
                } else {
                    console.log("orbit image edit: ", orbit?.ImageURL);
                    const newOrbit = await addNewOrbit(userToken?.toString(), orbit);
                    setOrbit(newOrbit);
                    navigate(`/orbits/${newOrbit.Name}/edit`);
                }
            }
        } catch (error) {
            console.error('Ошибка при сохранении орбиты:', error);
        }
    };

    return (
        <Form onSubmit={handleOrbitSubmit} encType="multipart/form-data">
            <Form.Group controlId="formOrbitImage">
                <Form.Label>Изображение</Form.Label>
                <Form.Control
                    type="file"
                    name="image"
                    onChange={handleChange}
                />
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
            <Form.Group controlId="formOrbitApogee">
                <Form.Label>Перигей</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Введите перигей"
                    name="Perigee"
                    value={orbit?.Perigee || ''}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group controlId="formOrbitApogee">
                <Form.Label>Наклонение</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Введите наклонение"
                    name="Inclination"
                    value={orbit?.Inclination || ''}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group controlId="formOrbitApogee">
                <Form.Label>Описание</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Введите описание"
                    name="Description"
                    value={orbit?.Description || ''}
                    onChange={handleChange}
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                {orbit_name && orbit_name !== 'add' ? 'Сохранить изменения' : 'Добавить орбиту'}
            </Button>
        </Form>
    );
};

export default OrbitForm;
