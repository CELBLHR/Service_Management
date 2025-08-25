from typing import Any, Dict, Optional
from flask import jsonify


def success(data: Any = None, message: Optional[str] = None, status: int = 200) -> tuple:
    """统一成功响应格式"""
    response = {
        'success': True,
        'data': data
    }
    if message:
        response['message'] = message
    
    return jsonify(response), status


def fail(error: str, code: Optional[str] = None, status: int = 400, details: Optional[Any] = None) -> tuple:
    """统一失败响应格式"""
    response = {
        'success': False,
        'error': error
    }
    if code:
        response['code'] = code
    if details:
        response['details'] = details
    
    return jsonify(response), status
