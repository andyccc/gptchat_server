
https://www.apple.com/certificateauthority/AppleRootCA-G3.cer
https://www.apple.com/certificateauthority/


openssl x509 -inform der -in AppleRootCA-G3.cer -out AppleRootCA-G3.pem
