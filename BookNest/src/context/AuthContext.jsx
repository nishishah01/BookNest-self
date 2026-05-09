import { React, useState, createContext, useContext, useEffect } from 'react'
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom'
import Cookies from "js-cookie";

const AuthContext = createContext()
export default AuthContext;

export const AuthProvider = ({children}) => {
    
    let api_link = import.meta.env.VITE_BACKEND_URL ? (import.meta.env.VITE_BACKEND_URL.endsWith('/') ? import.meta.env.VITE_BACKEND_URL : import.meta.env.VITE_BACKEND_URL + '/') : "http://localhost:8000/";
    const navigate = useNavigate();

    let [loading, setLoading] = useState(true)
    let [user, setUser] = useState(() => {
        const tokens = localStorage.getItem("authTokens");
        if (tokens) {
            try {
                const parsedTokens = JSON.parse(tokens);
                return jwtDecode(parsedTokens.access);
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem("authTokens");
                return null;
            }
        }
        return null;
    })
    
    let [authTokens, setAuthTokens] = useState(() => {
        const tokens = localStorage.getItem("authTokens");
        if (tokens) {
            try {
                return JSON.parse(tokens);
            } catch (error) {
                console.error("Error parsing authTokens:", error);
                localStorage.removeItem("authTokens");
                return null;
            }
        }
        return null;
    })
    
    const [cookieToken, setCookieToken] = useState(() => {
        const tokens = localStorage.getItem("authTokens");
        if (tokens) {
            try {
                return JSON.parse(tokens);
            } catch (error) {
                console.error("Error parsing cookieToken:", error);
                return null;
            }
        }
        return null;
    });

    let loginUser = async(e) => {
        e.preventDefault()
        let response = await fetch(api_link+"base/auth/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": e.target.username.value,
                "password": e.target.password.value
            })
        })
        if(response.status === 200) {
            let data = await response.json()
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data))
            
            Cookies.set('token', `${data.access}`, {expires : 1});
            setCookieToken(data);

            navigate("/home")
        } else {
            let errorText = await response.text();
            alert("Something went wrong:\n" + errorText);
        }
    }
    
    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        Cookies.remove('token');
        setCookieToken(null);
        navigate("/")
    }

    let updateToken = async() => {
        // Check if we have a valid refresh token before making the request
        if (!authTokens?.refresh) {
            console.log("No refresh token available");
            if (loading) {
                setLoading(false);
            }
            return;
        }

        try {
            let response = await fetch(api_link+"base/auth/token/refresh/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"refresh": authTokens.refresh})
            })
            
            if(response.status === 200) {
                let data = await response.json()
                setAuthTokens(data)
                setUser(jwtDecode(data.access))
                localStorage.setItem("authTokens", JSON.stringify(data))

                Cookies.set('token', `${data.access}`, {expires : 1});
                setCookieToken(data);
                
                console.log("Token refreshed successfully");
            } else {
                console.log("Token refresh failed:", response.status, response.statusText);
                // Only logout if it's a 401 (unauthorized) or 403 (forbidden)
                if (response.status === 401 || response.status === 403) {
                    logoutUser();
                }
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            // Don't logout on network errors, just log the error
        }
        
        if(loading) {
            setLoading(false)
        }
    }

    let contextData = {
        user: user,
        api_link: api_link,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
        updateToken: updateToken,
    }

    useEffect(() => {
        if(loading) {
            if(authTokens?.refresh) {
                updateToken()
            } else {
                setLoading(false)
            }
        }

        let interval = setInterval(() => {
            if(authTokens?.refresh) {
                updateToken()
            }
        }, 1000*60*4) // call updateToken after every 4 minutes
        return () => clearInterval(interval)
    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData} >
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    )
}
