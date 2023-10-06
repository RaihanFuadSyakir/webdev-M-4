package keygenerator

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
)

func generateKey() {
	secretKey, err := generateRandomSecretKey(32) // 32 bytes for a 256-bit key
	if err != nil {
		fmt.Println("Error generating secret key:", err)
		return
	}
	fmt.Println("Generated Secret Key:", secretKey)
}
func generateRandomSecretKey(length int) (string, error) {
	key := make([]byte, length)
	_, err := rand.Read(key)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(key), nil
}
