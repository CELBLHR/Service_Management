from typing import Any, Dict, Optional
from flask import Flask, jsonify


class AppError(Exception):
    """应用通用异常类"""
    def __init__(self, message: str, code: str = 'AppError', status: int = 400, details: Optional[Any] = None):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status = status
        self.details = details


def register_error_handlers(app: Flask) -> None:
    """注册全局错误处理器"""
    
    @app.errorhandler(AppError)
    def handle_app_error(error: AppError):
        """处理应用自定义异常"""
        return jsonify({
            'success': False,
            'error': error.message,
            'code': error.code,
            'details': error.details
        }), error.status
    
    @app.errorhandler(404)
    def not_found(error):
        """404错误处理"""
        return jsonify({
            'success': False,
            'error': '页面未找到',
            'code': 'NotFound'
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        """500错误处理"""
        return jsonify({
            'success': False,
            'error': '服务器内部错误',
            'code': 'InternalError'
        }), 500
    
    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        """处理未预期的异常"""
        # 在生产环境中应该记录日志
        print(f"未预期的异常: {str(error)}")
        return jsonify({
            'success': False,
            'error': '服务器内部错误',
            'code': 'UnexpectedError'
        }), 500
