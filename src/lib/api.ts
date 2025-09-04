export async function loginUser(email: string, password: string) {
  const res:Response = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }
  
  return res.json();
}

export async function registerUser({name, email, password, confirmPassword}: {name: string, email: string, password: string, confirmPassword: string}) {
  const res:Response = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type" : "application/json",
    },
    body: JSON.stringify({ name, email, password, password_confirmation: confirmPassword }),
    credentials: "include",
  });
   if (!res.ok) {
    throw new Error("Register failed");
  }
  
  return res.json();
}
