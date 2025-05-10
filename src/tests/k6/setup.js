import http from 'k6/http';
import { check} from 'k6';

const AUTH_URL = 'http://localhost:5000';
const LOGIN_ENDPOINT = `${AUTH_URL}/auth/login`;

export function login_user(test_user) {
    const res = http.post(LOGIN_ENDPOINT, JSON.stringify(test_user), {
        headers: { 'Content-Type': 'application/json' },
    });
    
    check(res, {
        'login successful': (r) => r.status === 200,
    });
    
    const data = res.json();
    return {
        token: data.access_token,
        user_id: data.user_id,
    };
}