set -euo pipefail
BASE="http://localhost:4000/api/v1/auth/register"
pw="Password1@123"
declare -a role_vals=("farmer" "vendor" "expert" "ngo")
declare -a name_vals=("Farmer Test" "Vendor Test" "Expert Teacher Test" "NGO Test")
declare -a email_vals=("farmer@test.example" "vendor@test.example" "expert-teacher@test.example" "ngo@test.example")
for i in 0 1 2 3; do
  role="${role_vals[$i]}"
  name="${name_vals[$i]}"
  email="${email_vals[$i]}"
  body=$(cat <<EOF
{"name":"${name}","email":"${email}","phone":"","password":"${pw}","role":"${role}"}
EOF
)
  printf 'ROLE=%s\n' "$role"
  curl -sS -D /tmp/reg_headers_${role}.txt -o /tmp/reg_body_${role}.json -H "content-type: application/json" -X POST "$BASE" --data "$body"
  echo '---'
done
