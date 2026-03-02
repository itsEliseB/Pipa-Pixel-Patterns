from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..database import get_db
from ..models import Design, User
from ..schemas import DesignCreate, DesignResponse

router = APIRouter(prefix="/api", tags=["designs"])


@router.get("/designs", response_model=list[DesignResponse])
def list_designs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Design).filter(Design.user_id == current_user.id).all()


@router.post("/designs", response_model=DesignResponse, status_code=201)
def create_design(
    design_data: DesignCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    design = Design(
        title=design_data.title,
        description=design_data.description,
        user_id=current_user.id,
        pattern_type=design_data.pattern_type,
        width=design_data.width,
        height=design_data.height,
        canvas_data=design_data.canvas_data,
    )
    db.add(design)
    db.commit()
    db.refresh(design)
    return design
