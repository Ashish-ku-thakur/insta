import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import axios from "axios";
import { USER_API } from "@/constant/variables";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Signup = () => {
    let [input, setInput] = useState({
        fullname: "",
        email: "",
        password: "",
    });

    let navigate = useNavigate()

    let changeEventHandler = (e) => {
        setInput({ ...input, [e?.target?.name]: e?.target?.value });
    };

    let [loading, setLoading] = useState(false)

    //register user
    let signupHandler = async (e) => {
        e?.preventDefault();
        try {

            setLoading(true)
            //register user
            let res = await axios.post(`${USER_API}/register`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })

            if (res?.data?.success) {
                navigate("/login")
                toast.success(res?.data?.massage)
                console.log(res?.data);
                setInput("")
            }

        } catch (error) {
            toast.error(error?.response?.data?.massage)
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="border-black border-[1px] w-screen h-screen flex items-center justify-center">
            <form
                onSubmit={signupHandler}
                className="shadow-2xl flex gap-5 flex-col p-7 w-1/3"
            >
                <div className="mb-4">
                    <h1 className="w-full font-bold text-2xl text-center">Logo</h1>
                    <p className="w-full text-center">Signup to see photos and videos</p>
                </div>

                <div>
                    <Label className="py-2">Fullname:</Label>
                    <Input
                        type="text"
                        placeholder="Fullname"
                        name="fullname"
                        value={input.fullname}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent"
                    />
                </div>

                <div>
                    <Label className="py-2">Email:</Label>
                    <Input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent"
                    />
                </div>

                
                <div>
                    <Label className="py-2">Password:</Label>
                    <Input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent"
                    />
                </div>

                <div>
                    <p>Already have an account? please<Link to={"/login"} className="text-blue-500 font-bold">Login</Link></p>
                </div>

                {
                    loading ? (
                        <Button>
                            <Loader2 className="mr-4 h-4 w-4 animate-spin" />
                            Please wait
                        </Button>
                    ) : (

                        <Button type="submit">Signup</Button>
                    )
                }

            </form>
        </div>
    );
};

export default Signup;
