from flask import Blueprint
from app.responses import success
import datetime


health_bp = Blueprint('health', __name__)


@health_bp.route('/test')
def api_test():
    return success(
        data={
            'message': 'API服务正常',
            'timestamp': datetime.datetime.now().isoformat()
        }
    )


