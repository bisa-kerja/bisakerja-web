async function run() {
  const res = await fetch("https://bisakerja-api.salmanabdurrahman.my.id/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: "test1778253175900@example.com",
      password: "Password123!@"
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
run();
