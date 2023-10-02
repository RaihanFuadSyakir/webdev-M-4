package controllers

type Response struct {
	OK     bool        `json:"ok"`
	Status int         `json:"status"`
	Msg    string      `json:"msg"`
	Data   interface{} `json:"data"`
}
