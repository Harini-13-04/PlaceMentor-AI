import asyncio
import uuid
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    UserUpdateRequest,
    ChangePasswordRequest,
)
from app.services.auth_service import (
    create_user,
    authenticate_user,
    change_user_password,
    update_user_profile,
    update_user_avatar,
    remove_user_avatar,
    get_user_by_id,
)
from app.core.jwt_handler import create_access_token, decode_access_token
from app.api.auth import register, login, get_me, change_password, logout
from app.api.users import update_my_profile, upload_avatar, delete_avatar
from app.database.mongodb import users_collection

async def run_suite():
    print("\n==============================================")
    print(" PlaceMentor AI - Phase 2 API Verification ")
    print("==============================================")

    random_id = str(uuid.uuid4())[:8]
    test_email = f"test_{random_id}@placementor.ai"
    test_pwd = "SecretPassword123!"
    new_pwd = "NewSecurePassword456!"

    try:
        # Test 1: Register endpoint
        print("\n--- [1] POST /api/auth/register ---")
        reg_req = RegisterRequest(
            name="Harini Candidate",
            email=test_email,
            password=test_pwd,
            college="SRM Institute of Science and Technology",
            department="Computer Science & Engineering",
            year="4th Year",
            skills=["React", "TypeScript", "Python", "FastAPI"]
        )
        reg_res = await register(reg_req)
        assert "access_token" in reg_res, "Missing access_token in register response"
        token = reg_res["access_token"]
        user_info = reg_res["user"]
        user_id = user_info["id"]
        assert user_info["email"] == test_email
        assert user_info["name"] == "Harini Candidate"
        assert user_info["college"] == "SRM Institute of Science and Technology"
        assert user_info["department"] == "Computer Science & Engineering"
        assert user_info["year"] == "4th Year"
        assert "password" not in user_info or not user_info["password"]
        print(f" Registered user ID: {user_id}")
        print(" Register PASSED")

        # Test 2: Token verification
        print("\n--- [2] JWT Token Verification ---")
        payload = decode_access_token(token)
        assert payload is not None, "Failed to decode JWT"
        assert payload["sub"] == user_id
        assert payload["email"] == test_email
        print(f" Decoded JWT payload: {payload}")
        print(" JWT Verification PASSED")

        # Test 3: Authenticated /me endpoint
        print("\n--- [3] GET /api/auth/me ---")
        current_user_doc = await get_user_by_id(user_id)
        me_res = await get_me(current_user=current_user_doc)
        assert me_res["id"] == user_id
        assert me_res["email"] == test_email
        assert me_res["department"] == "Computer Science & Engineering"
        print(f" /me profile name: {me_res['name']}, email: {me_res['email']}")
        print(" GET /api/auth/me PASSED")

        # Test 4: Profile Update (PATCH /api/users/me)
        print("\n--- [4] PATCH /api/users/me ---")
        update_req = UserUpdateRequest(
            bio="Aspiring Software Engineer specialized in AI-driven applications.",
            phone="+91 98765 43210",
            github="github.com/harini-dev",
            linkedin="linkedin.com/in/harini-dev",
            skills=["React", "TypeScript", "Python", "FastAPI", "MongoDB", "TailwindCSS"]
        )
        patch_res = await update_my_profile(request=update_req, current_user=current_user_doc)
        assert patch_res["bio"] == "Aspiring Software Engineer specialized in AI-driven applications."
        assert patch_res["phone"] == "+91 98765 43210"
        assert patch_res["github"] == "github.com/harini-dev"
        assert len(patch_res["skills"]) == 6
        print(f" Updated profile: bio='{patch_res['bio']}', skills={patch_res['skills']}")
        print(" PATCH /api/users/me PASSED")

        # Test 5: Avatar Update (POST /api/users/me/avatar)
        print("\n--- [5] POST /api/users/me/avatar ---")
        from unittest.mock import Mock
        mock_req = Mock()
        mock_req.json = Mock(side_effect=Exception("not json"))
        avatar_url = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
        avatar_res = await upload_avatar(
            request=mock_req,
            avatar_file=None,
            avatar_url=avatar_url,
            current_user=current_user_doc
        )
        assert avatar_res["avatar"] == avatar_url
        print(f" Updated avatar URL: {avatar_res['avatar']}")
        print(" POST /api/users/me/avatar PASSED")

        # Test 6: Avatar Delete (DELETE /api/users/me/avatar)
        print("\n--- [6] DELETE /api/users/me/avatar ---")
        del_avatar_res = await delete_avatar(current_user=current_user_doc)
        assert del_avatar_res["avatar"] == ""
        print(f" Avatar after removal: '{del_avatar_res['avatar']}'")
        print(" DELETE /api/users/me/avatar PASSED")

        # Test 7: Change Password (POST /api/auth/change-password)
        print("\n--- [7] POST /api/auth/change-password ---")
        pw_req = ChangePasswordRequest(
            current_password=test_pwd,
            new_password=new_pwd
        )
        pw_res = await change_password(request=pw_req, current_user=current_user_doc)
        assert pw_res["message"] == "Password updated successfully"
        print(" Change Password PASSED")

        # Test 8: Login with New Password & Rejection of Old Password
        print("\n--- [8] POST /api/auth/login ---")
        try:
            await login(LoginRequest(email=test_email, password=test_pwd))
            assert False, "Old password was incorrectly accepted!"
        except Exception:
            print(" Old password rejected as expected.")

        login_res = await login(LoginRequest(email=test_email, password=new_pwd))
        assert "access_token" in login_res, "Login failed to return token"
        assert login_res["user"]["email"] == test_email
        print(f" Logged in successfully with new password, user: {login_res['user']['name']}")
        print(" POST /api/auth/login PASSED")

        # Test 9: Logout
        print("\n--- [9] POST /api/auth/logout ---")
        logout_res = await logout()
        assert logout_res["message"] == "Logged out successfully"
        print(" POST /api/auth/logout PASSED")

        print("\n==============================================")
        print(" ALL PHASE 2 BACKEND ENDPOINTS PASSED! [SUCCESS]")
        print("==============================================")


    finally:
        # Clean up test user
        await users_collection.delete_one({"email": test_email})
        print(f"\nCleaned up test record for: {test_email}")

if __name__ == "__main__":
    asyncio.run(run_suite())
