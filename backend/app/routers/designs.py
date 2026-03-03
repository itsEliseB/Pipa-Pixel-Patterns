from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..database import get_db
from ..models import Design, User
from ..schemas import DesignCreate, DesignRename, DesignResponse, DesignUpdate

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


def _get_owned_design(design_id: int, current_user: User, db: Session) -> Design:
    design = db.query(Design).filter(Design.id == design_id, Design.user_id == current_user.id).first()
    if not design:
        raise HTTPException(status_code=404, detail="Design not found")
    return design


@router.get("/designs/{design_id}", response_model=DesignResponse)
def get_design(
    design_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return _get_owned_design(design_id, current_user, db)


@router.patch("/designs/{design_id}", response_model=DesignResponse)
def rename_design(
    design_id: int,
    data: DesignRename,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    design = _get_owned_design(design_id, current_user, db)
    design.title = data.title
    db.commit()
    db.refresh(design)
    return design


@router.put("/designs/{design_id}", response_model=DesignResponse)
def update_design(
    design_id: int,
    data: DesignUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    design = _get_owned_design(design_id, current_user, db)
    design.title = data.title
    design.description = data.description
    design.canvas_data = data.canvas_data
    db.commit()
    db.refresh(design)
    return design


@router.delete("/designs/{design_id}", status_code=204)
def delete_design(
    design_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    design = _get_owned_design(design_id, current_user, db)
    db.delete(design)
    db.commit()
