import { Typography, Box, TextField, Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

// Esquema de validación usando Yup
const schema = yup.object().shape({
    nombre: yup
        .string()
        .required("El nombre es obligatorio")
        .matches(/^[A-Za-z\s]+$/, "Solo se permiten letras en el nombre"),
    
    tipoDocu: yup
        .string()
        .required("Seleccione un tipo de documento"),
    
    numeroDocu: yup
        .string()
        .required("El número de documento es obligatorio")
        .matches(/^[0-9]+$/, "Debe ser un número válido")
        .min(6, "Debe tener al menos 6 dígitos"),

    correo: yup
        .string()
        .email("Debe ser un correo electrónico válido")
        .required("El correo electrónico es obligatorio"),
    
    tipoAsis: yup
        .string()
        .required("Seleccione un tipo de asistente"),

    institucion: yup
        .string()
        .when("tipoAsis", (tipoAsis, schema) =>
            ["DOCENTE", "EXPOSITOR", "PONENTE", "LOGISTICA"].includes(tipoAsis)
                ? schema
                    .required("La institución es obligatoria para este tipo de asistente")
                    .matches(/^[A-Za-z\s]+$/, "Solo se permiten letras en el nombre de la institución")
                : schema.notRequired()
        ),

    programa: yup
        .string()
        .when("tipoAsis", (tipoAsis, schema) =>
            tipoAsis === "ESTUDIANTE"
                ? schema.required("El programa es obligatorio para estudiantes")
                : schema.notRequired()
        ),
    
    campus: yup
        .string()
        .when("tipoAsis", (tipoAsis, schema) =>
            tipoAsis === "ESTUDIANTE"
                ? schema.required("El campus es obligatorio para estudiantes")
                : schema.notRequired()
        ),
    
    tipoSector: yup
        .string()
        .when("tipoAsis", (tipoAsis, schema) =>
            tipoAsis === "SECTOR_EXTERNO"
                ? schema.required("Seleccione un tipo de sector")
                : schema.notRequired()
        ),
    
    empresaNombre: yup
        .string()
        .when("tipoAsis", (tipoAsis, schema) =>
            tipoAsis === "SECTOR_EXTERNO"
                ? schema
                    .required("El nombre de la empresa es obligatorio")
                    .matches(/^[A-Za-z\s]+$/, "Solo se permiten letras en el nombre de la empresa")
                : schema.notRequired()
        ),

    contac1: yup
        .string()
        .required("El contacto 1 es obligatorio")
        .matches(/^[0-9]+$/, "Debe ser un número de contacto válido")
        .min(7, "El contacto debe tener al menos 7 dígitos"),
    
    contacto2: yup
        .string()
        .matches(/^[0-9]*$/, "Debe ser un número de contacto válido")
});

function Registro() {
    const programas = [
        'TECNOLOGÍA EN DESARROLLO DE SOFTWARE',
        'TECNOLOGÍA AGROAMBIENTAL',
        'CONTADURÍA PÚBLICA',
        'ADMINISTRACIÓN DE EMPRESAS',
        'TECNOLOGÍA EN GESTIÓN DE ORGANIZACIONES TURÍSTICAS'
    ];

    const campus = [
        'SEDE CAICEDONIA',
        'NODO SEVILLA'
    ];

    const { control, handleSubmit, reset, watch } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            nombre: '',
            tipoDocu: '',
            numeroDocu: '',
            correo: '',
            tipoAsis: '',
            institucion: '',
            programa: '',
            campus: '',
            contac1: '',
            contacto2: '',
            tipoSector: '',
            empresaNombre: ''
        }
    });

    const tipoAsis = watch("tipoAsis");

    const onSubmit = async (data) => {
        const verificando = (toast.loading("Verificando documento..."));

        try {
            // Verificar si el usuario con la cédula ya está registrado
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/buscar-usuario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    numeroDocu: data.numeroDocu
                }),
            });

            if (response.ok) {
                const user = await response.json();
                console.log(user)
                toast.error("El número de documento ya está registrado.");
                toast.dismiss(verificando)
            } else {
                // Si no existe, proceder a registrar el nuevo usuario
                const registerResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: data.nombre,
                        document_type: data.tipoDocu,
                        document_number: data.numeroDocu,
                        email: data.correo,
                        assistant_type: data.tipoAsis,
                        program: data.programa,
                        campus: data.campus,
                        institution: data.institucion,
                        type_sector: data.tipoSector,
                        name_enterprise: data.empresaNombre,
                        contac1: data.contac1,
                        contact_2: data.contacto2,
                    }),
                });

                toast.dismiss();
                if (registerResponse.ok) {
                    toast.success("Usuario registrado con éxito");
                    reset();
                } else {
                    const errorData = await registerResponse.json();
                    if(errorData.error === 'El correo electrónico ya está registrado'){
                        toast.error("El correo electronico ya esta registrado")
                    }else {
                        toast.error("Error al registrar el usuario")
                        //throw new Error("Error al registrar el usuario");
                    }
                }
            }
        } catch (error) {
            toast.dismiss();
            console.log(error)
            toast.error("Hubo un error al procesar la solicitud");
        }
    };

    return (
        <>
        <ToastContainer
        pauseOnHover/>
        <Box className="shadow-2xl rounded-2xl max-w-[23rem] mx-auto flex flex-col w-[40rem]" component="form" onSubmit={handleSubmit(onSubmit)}>
            <Typography class="text-4xl">Preinscripción evento semana de la ingeniería</Typography>

            <Controller
                name="nombre"
                control={control}
                render={({ field, fieldState }) => (
                    <FormControl sx={{ margin: '10px' }}>
                        <TextField {...field} label="Nombre Completo" error={!!fieldState.error} helperText={fieldState.error?.message} required />
                    </FormControl>
                )}
            />

            <Controller
                name="tipoDocu"
                control={control}
                render={({ field, fieldState }) => (
                    <FormControl sx={{ margin: '10px' }} error={!!fieldState.error}>
                        <InputLabel>Tipo de Documento</InputLabel>
                        <Select {...field} label="Tipo de Documento" required>
                            <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
                            <MenuItem value="TI">Tarjeta de Identidad</MenuItem>
                            <MenuItem value="CE">Cédula de Extranjería</MenuItem>
                        </Select>
                        {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}
                    </FormControl>
                )}
            />

            <Controller
                name="numeroDocu"
                control={control}
                render={({ field, fieldState }) => (
                    <FormControl sx={{ margin: '10px' }}>
                        <TextField {...field} label="Número de Documento" error={!!fieldState.error} helperText={fieldState.error?.message} required />
                    </FormControl>
                )}
            />

            <Controller
                name="correo"
                control={control}
                render={({ field, fieldState }) => (
                    <FormControl sx={{ margin: '10px' }}>
                        <TextField {...field} label="Correo Electrónico" error={!!fieldState.error} helperText={fieldState.error?.message} required />
                    </FormControl>
                )}
            />

            <Controller
                name="tipoAsis"
                control={control}
                render={({ field, fieldState }) => (
                    <FormControl sx={{ margin: '10px' }} error={!!fieldState.error}>
                        <InputLabel>Tipo de Asistente</InputLabel>
                        <Select {...field} label="Tipo de Asistente" required>
                            <MenuItem value="ESTUDIANTE">Estudiante</MenuItem>
                            <MenuItem value="DOCENTE">Docente</MenuItem>
                            <MenuItem value="EXPOSITOR">Expositor</MenuItem>
                            <MenuItem value="PONENTE">Ponente</MenuItem>
                            <MenuItem value="LOGISTICA">Logística</MenuItem>
                            <MenuItem value="SECTOR_EXTERNO">Sector Externo</MenuItem>
                        </Select>
                        {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}
                    </FormControl>
                )}
            />

            {["DOCENTE", "EXPOSITOR", "PONENTE", "LOGISTICA"].includes(tipoAsis) && (
                <Controller
                    name="institucion"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FormControl sx={{ margin: '10px' }}>
                            <TextField {...field} label="Nombre de la Institución" error={!!fieldState.error} helperText={fieldState.error?.message} />
                        </FormControl>
                    )}
                />
            )}

            {tipoAsis === 'ESTUDIANTE' && (
                <>
                    <Controller
                        name="programa"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormControl sx={{ margin: '10px' }}>
                                <InputLabel>Programa</InputLabel>
                                <Select {...field} label="Programa" required>
                                    {programas.map((programa) => (
                                        <MenuItem key={programa} value={programa}>{programa}</MenuItem>
                                    ))}
                                </Select>
                                {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}
                            </FormControl>
                        )}
                    />
                    <Controller
                        name="campus"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormControl sx={{ margin: '10px' }}>
                                <InputLabel>Campus</InputLabel>
                                <Select {...field} label="Campus" required>
                                    {campus.map((campusOption) => (
                                        <MenuItem key={campusOption} value={campusOption}>{campusOption}</MenuItem>
                                    ))}
                                </Select>
                                {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}
                            </FormControl>
                        )}
                    />
                </>
            )}

            {tipoAsis === 'SECTOR_EXTERNO' && (
                <>
                <Controller
                        name="tipoSector"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormControl sx={{ margin: '10px' }}>
                                <InputLabel>Tipo de Sector</InputLabel>
                                <Select {...field} label="Tipo de Sector" required>
                                    <MenuItem value="PUBLICO">Público</MenuItem>
                                    <MenuItem value="PRIVADO">Privado</MenuItem>
                                </Select>
                                {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}
                            </FormControl>
                        )}
                    />
                    <Controller
                        name="empresaNombre"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormControl sx={{ margin: '10px' }}>
                                <TextField {...field} label="Nombre de la Empresa" error={!!fieldState.error} helperText={fieldState.error?.message} />
                            </FormControl>
                        )}
                    />
                </>
            )}

            <Controller
                name="contac1"
                control={control}
                render={({ field, fieldState }) => (
                    <FormControl sx={{ margin: '10px' }}>
                        <TextField {...field} label="Número de Contacto 1" error={!!fieldState.error} helperText={fieldState.error?.message} required />
                    </FormControl>
                )}
            />

            <Controller
                name="contacto2"
                control={control}
                render={({ field, fieldState }) => (
                    <FormControl sx={{ margin: '10px' }}>
                        <TextField {...field} label="Número de Contacto 2" error={!!fieldState.error} helperText={fieldState.error?.message} />
                    </FormControl>
                )}
            />

            <Button type="submit" variant="contained" sx={{ margin: '10px' }}>Registrar</Button>
        </Box>
        </>
    );
}

export default Registro;
