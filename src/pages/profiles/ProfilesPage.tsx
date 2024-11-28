import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Input,
} from "@nextui-org/react";
import Logo from "../../assets/images/Logo.png";
import { useAuthStore, useProfileStore } from "../../stores";
import { useEffect, useState } from "react";
import { formatTime } from "../../lib";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imageDb } from "../../components/utils/FirebaseImageStorage";

export const ProfilesPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const profiles = useProfileStore((state) => state.profiles);
  const getProfiles = useProfileStore((state) => state.getProfiles);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const [file, setFile] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFetchProfiles = async () => {
    setIsLoading(true);
    await getProfiles(token!);
    setIsLoading(false);
  };

  useEffect(() => {
    handleFetchProfiles();
  }, []);

  const profile = profiles[0] || {
    name: "",
    lastname: "",
    email: "",
    document: "",
    createdAt: "",
    image: "",
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(imageUrl);
    }
  };

  const uploadImage = async (file: File) => {
    const fileName = `IMG_${user?.id}`;
    const storageRef = ref(imageDb, `profile_users/${fileName}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    console.log("URL:" + downloadURL);
    return downloadURL;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const { Name, lastname, email } = e.target as typeof e.target & {
      Name: { value: string };
      lastname: { value: string };
      email: { value: string };
    };
    let profileImageUrl = profile.image;

    if (file) {
      profileImageUrl = await uploadImage(file);
    }
    const validationErrors = await updateProfile(
      profile.id,
      Name.value,
      lastname.value,
      email.value,
      password,
      confirmPassword,
      profileImageUrl,
      token!
    );

    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      // Clear password fields on successful update
      setPassword("");
      setConfirmPassword("");
    }

    setIsLoading(false);
  };

  const getErrorMessage = (field: string) => {
    return errors[field] ? errors[field][0] : "";
  };

  const isFieldInvalid = (field: string) => {
    return !!errors[field];
  };

  return (
    <div className="pt-10 pb-2.5 px-4 flex justify-center w-full">
      <div className="grid grid-cols-1 md:grid-cols-10 gap-4 max-w-6xl w-full">
        <Card className="col-span-1 md:col-span-4">
          <CardBody className="justify-center items-center p-8">
            <Image
              width={100}
              height={100}
              alt="profile"
              src={previewImage || profile.image || Logo}
              radius="full"
              shadow="md"
              className="object-cover "
              style={{ width: "100px", height: "100px" }}
            />
            <button
              className="mt-[-20px] ml-24 w-[30px] h-[30px] bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <i className="fa-solid fa-camera text-xs"></i>
            </button>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <h1 className="mt-3 text-2xl font-semibold">
              {profile.name} {profile.lastname}
            </h1>
            <p className="mt-2 text-gray-500">
              <i className="fas fa-envelope"></i> {profile.email}
            </p>
            <p className="mt-1 text-gray-500">
              <i className="fas fa-id-card"></i> {profile.document}
            </p>
            <Divider className="mt-5" />
            <h5 className="text-center mt-5 text-xl font-semibold">
              Fecha Registro
            </h5>
            <p className="mt-1 text-gray-500">
              {formatTime(profile.createdAt)}
            </p>
            <Divider className="mt-5" />
            <h5 className="text-center mt-2 text-xl font-semibold">Rol</h5>
            <p className="mt-1 text-gray-500">{user?.roles}</p>
          </CardBody>
        </Card>
        <Card className="col-span-1 md:col-span-6">
          <form onSubmit={handleSubmit}>
            <CardBody className="justify-center items-center pt-10 px-8 pb-4 grid grid-cols-1 gap-4">
              <Input
                name="Name"
                label={
                  <>
                    Nombre <span className="text-red-500">*</span>
                  </>
                }
                variant="bordered"
                placeholder="Modifica Nombre"
                labelPlacement="outside"
                value={profile.name}
                isInvalid={isFieldInvalid("name")}
                errorMessage={getErrorMessage("name")}
              />
              <Input
                name="lastname"
                label={
                  <>
                    Apellido <span className="text-red-500">*</span>
                  </>
                }
                variant="bordered"
                placeholder="Modifica Apellido"
                labelPlacement="outside"
                value={profile.lastname}
                isInvalid={isFieldInvalid("lastname")}
                errorMessage={getErrorMessage("lastname")}
              />
              <Input
                name="email"
                label={
                  <>
                    Email <span className="text-red-500">*</span>
                  </>
                }
                type="email"
                variant="bordered"
                placeholder="Modifica Email"
                labelPlacement="outside"
                value={profile.email}
                isInvalid={isFieldInvalid("email")}
                errorMessage={getErrorMessage("email")}
              />
              <Input
                name="Password"
                label={
                  <>
                    Contraseña <span className="text-red-500">*</span>
                  </>
                }
                variant="bordered"
                placeholder="****"
                labelPlacement="outside"
                isInvalid={isFieldInvalid("password")}
                errorMessage={getErrorMessage("password")}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label="toggle password visibility"
                  >
                    {isPasswordVisible ? (
                      <i className="fa-solid fa-eye"></i>
                    ) : (
                      <i className="fa-solid fa-eye-slash"></i>
                    )}
                  </button>
                }
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                name="Password_confirmation"
                label={
                  <>
                    Confirmar Contraseña
                    <span className="text-red-500">*</span>
                  </>
                }
                variant="bordered"
                placeholder="****"
                labelPlacement="outside"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    aria-label="toggle password visibility"
                  >
                    {isConfirmPasswordVisible ? (
                      <i className="fa-solid fa-eye"></i>
                    ) : (
                      <i className="fa-solid fa-eye-slash"></i>
                    )}
                  </button>
                }
                type={isConfirmPasswordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </CardBody>
            <CardFooter className="justify-center pb-4">
              <Button
                variant="shadow"
                isLoading={isLoading}
                isDisabled={isLoading}
                color="primary"
                type="submit"
                radius="lg"
                className="w-1/2 md:w-1/3"
              >
                Guardar
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
