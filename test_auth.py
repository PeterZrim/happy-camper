import requests
import json
import uuid

BASE_URL = 'http://localhost:8000/api/auth'

def test_auth_flow():
    # Generate unique username
    unique_id = str(uuid.uuid4())[:8]
    
    # Test registration
    register_data = {
        'username': f'testuser_{unique_id}',
        'email': f'test_{unique_id}@example.com',
        'password': 'testpass123',
        'user_type': 'camper'
    }
    
    print("\n1. Testing Registration...")
    register_response = requests.post(f'{BASE_URL}/register/', json=register_data)
    print(f"Status: {register_response.status_code}")
    print(f"Response: {json.dumps(register_response.json(), indent=2)}")
    
    if register_response.status_code == 201:
        tokens = register_response.json()['tokens']
        access_token = tokens['access']
        refresh_token = tokens['refresh']
        headers = {'Authorization': f'Bearer {access_token}'}
        
        # Test protected endpoint
        print("\n2. Testing Protected Endpoint (Profile)...")
        profile_response = requests.get(f'{BASE_URL}/profile/', headers=headers)
        print(f"Status: {profile_response.status_code}")
        print(f"Response: {json.dumps(profile_response.json(), indent=2)}")
        
        # Test token refresh
        print("\n3. Testing Token Refresh...")
        refresh_response = requests.post(f'{BASE_URL}/token/refresh/', json={'refresh': refresh_token})
        print(f"Status: {refresh_response.status_code}")
        print(f"Response: {json.dumps(refresh_response.json(), indent=2)}")
        
        if refresh_response.status_code == 200:
            # Update access token for logout
            access_token = refresh_response.json()['access']
            headers = {'Authorization': f'Bearer {access_token}'}
        
        # Test logout with both tokens
        print("\n4. Testing Logout...")
        logout_response = requests.post(
            f'{BASE_URL}/logout/',
            json={'refresh': refresh_token},
            headers=headers
        )
        print(f"Status: {logout_response.status_code}")
        print(f"Response: {json.dumps(logout_response.json(), indent=2)}")
        
        # Verify tokens are blacklisted by trying to use them
        print("\n5. Verifying tokens are blacklisted...")
        profile_response = requests.get(f'{BASE_URL}/profile/', headers=headers)
        print(f"Access token blacklisted (should be 401): {profile_response.status_code}")
        
        refresh_response = requests.post(f'{BASE_URL}/token/refresh/', json={'refresh': refresh_token})
        print(f"Refresh token blacklisted (should be 401): {refresh_response.status_code}")

if __name__ == '__main__':
    test_auth_flow()
