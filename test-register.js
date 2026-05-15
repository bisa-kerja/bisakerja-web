async function run() {
  const res = await fetch("https://bisakerja-api.salmanabdurrahman.my.id/api/v1/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "testuser" + Date.now().toString().slice(-6),
      email: "test" + Date.now() + "@example.com",
      phoneNumber: "+62812" + Date.now().toString().slice(-8),
      password: "Password123!@",
      confirmPassword: "Password123!@"
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
run();
