from utils import hash_password, verify_password

hashed= hash_password("abc123")
print("Hash:", hashed)
print("Verify:", verify_password("abc123",hashed)) # uses Argon2id - a secure hybrid
                                                    #password hashing algorithm that combines the best features of Argon2d and Argon2i