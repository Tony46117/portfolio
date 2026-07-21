import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Copy, Check, Code, HelpCircle, Layers, FileCode } from 'lucide-react';

interface SchemaField {
  name: string;
  type: 'str' | 'int' | 'float' | 'bool' | 'datetime';
  required: boolean;
  defaultValue?: string;
}

export default function SchemaDesigner() {
  const [fields, setFields] = useState<SchemaField[]>([
    { name: 'id', type: 'int', required: true },
    { name: 'title', type: 'str', required: true },
    { name: 'description', type: 'str', required: false },
    { name: 'is_active', type: 'bool', required: true, defaultValue: 'True' },
    { name: 'price', type: 'float', required: true, defaultValue: '0.0' }
  ]);

  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<SchemaField['type']>('str');
  const [newFieldRequired, setNewFieldRequired] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'pydantic' | 'sqlalchemy' | 'routes'>('pydantic');

  // Generated code strings
  const [pydanticCode, setPydanticCode] = useState('');
  const [sqlalchemyCode, setSqlalchemyCode] = useState('');
  const [routesCode, setRoutesCode] = useState('');

  const mapPythonType = (type: SchemaField['type']) => {
    switch (type) {
      case 'str': return 'str';
      case 'int': return 'int';
      case 'float': return 'float';
      case 'bool': return 'bool';
      case 'datetime': return 'datetime';
      default: return 'str';
    }
  };

  const mapSqlAlchemyType = (type: SchemaField['type']) => {
    switch (type) {
      case 'str': return 'String';
      case 'int': return 'Integer';
      case 'float': return 'Float';
      case 'bool': return 'Boolean';
      case 'datetime': return 'DateTime';
      default: return 'String';
    }
  };

  useEffect(() => {
    // 1. Generate Pydantic Models (v2)
    const baseFields = fields.map(f => {
      let pyType = mapPythonType(f.type);
      if (!f.required) {
        pyType = `Optional[${pyType}]`;
      }
      let defaultValStr = '';
      if (!f.required) {
        defaultValStr = ' = None';
      } else if (f.defaultValue !== undefined) {
        defaultValStr = ` = ${f.defaultValue}`;
      }
      return `    ${f.name}: ${pyType}${defaultValStr}`;
    }).join('\n');

    const updateFields = fields.filter(f => f.name !== 'id').map(f => {
      return `    ${f.name}: Optional[${mapPythonType(f.type)}] = None`;
    }).join('\n');

    setPydanticCode(
`from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ProjectSchemaBase(BaseModel):
${baseFields}

class ProjectSchemaCreate(ProjectSchemaBase):
    pass

class ProjectSchemaUpdate(BaseModel):
${updateFields}

class ProjectSchemaResponse(ProjectSchemaBase):
    class Config:
        from_attributes = True # Pydantic v2 Compatibility`
    );

    // 2. Generate SQLAlchemy models
    const saFields = fields.map(f => {
      const saType = mapSqlAlchemyType(f.type);
      const isPk = f.name === 'id' ? ', primary_key=True, index=True' : '';
      const isNullable = f.required ? ', nullable=False' : ', nullable=True';
      const defaultVal = f.defaultValue !== undefined ? `, default=${f.defaultValue}` : '';
      return `    ${f.name} = Column(${saType}${isPk}${isNullable}${defaultVal})`;
    }).join('\n');

    setSqlalchemyCode(
`from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from db.session import Base
import datetime

class ProjectModel(Base):
    __tablename__ = "projects"

${saFields}`
    );

    // 3. Generate FastAPI Routes
    setRoutesCode(
`from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from db.session import get_db
from models.project import ProjectModel
from schemas.project import ProjectSchemaCreate, ProjectSchemaResponse, ProjectSchemaUpdate

router = APIRouter(prefix="/api/v1/projects", tags=["Projects"])

@router.post("/", response_model=ProjectSchemaResponse, status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectSchemaCreate, db: Session = Depends(get_db)):
    db_project = ProjectModel(**payload.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/{project_id}", response_model=ProjectSchemaResponse)
def read_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project model not found")
    return project`
    );
  }, [fields]);

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;

    // Sanitize python names
    const sanitizedName = newFieldName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    
    // Prevent duplicates
    if (fields.some(f => f.name === sanitizedName)) {
      alert('Field with that name already exists!');
      return;
    }

    const defaultVals: Record<SchemaField['type'], string | undefined> = {
      str: undefined,
      int: '0',
      float: '0.0',
      bool: 'True',
      datetime: 'datetime.utcnow'
    };

    setFields([
      ...fields,
      {
        name: sanitizedName,
        type: newFieldType,
        required: newFieldRequired,
        defaultValue: newFieldRequired ? defaultVals[newFieldType] : undefined
      }
    ]);

    setNewFieldName('');
  };

  const handleDeleteField = (name: string) => {
    if (name === 'id') return; // ID is required for primary keys
    setFields(fields.filter(f => f.name !== name));
  };

  const handleCopyCode = () => {
    const codeToCopy = activeTab === 'pydantic' ? pydanticCode : activeTab === 'sqlalchemy' ? sqlalchemyCode : routesCode;
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="schema-designer" className="bg-[#0a0a0a] p-6 rounded border border-white/5 text-[#e5e5e5] font-sans shadow-2xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/30">
            Model Architect
          </span>
          <span className="text-xs text-neutral-400 font-mono">Full-Stack Code Gen Engine</span>
        </div>
        <h4 className="text-xl font-sans font-bold text-white">SQL to Pydantic & SQLAlchemy Mapper</h4>
        <p className="text-neutral-400 text-sm max-w-2xl">
          Build structural SQL table schemas in real-time. This interactive component auto-compiles your structures into Python types, SQLAlchemy ORM mappings, and FastAPI endpoints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Schema Fields Modeler */}
        <div className="lg:col-span-5 bg-neutral-900/50 p-4.5 rounded border border-white/5 space-y-5">
          <h5 className="text-sm font-semibold text-neutral-200 flex items-center gap-2 pb-2 border-b border-white/5">
            <Layers className="w-4 h-4 text-indigo-400" />
            Field Definitions
          </h5>

          {/* Current Fields List */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {fields.map((f) => (
              <div 
                key={f.name}
                className="flex items-center justify-between p-2.5 bg-neutral-950 rounded border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs text-indigo-400 font-semibold">{f.name}</span>
                  <span className="text-[10px] font-mono text-neutral-500 px-1.5 py-0.5 bg-neutral-900 border border-white/5 rounded">
                    {f.type}
                  </span>
                  {!f.required && (
                    <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-1 py-0.5 rounded uppercase font-bold">
                      Optional
                    </span>
                  )}
                </div>
                {f.name !== 'id' ? (
                  <button
                    id={`btn-delete-${f.name}`}
                    onClick={() => handleDeleteField(f.name)}
                    className="p-1 text-neutral-500 hover:text-red-400 transition-colors rounded cursor-pointer animate-none"
                    title="Delete field"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[10px] text-neutral-600 font-mono italic">Primary Key</span>
                )}
              </div>
            ))}
          </div>

          {/* Add Field Form */}
          <form onSubmit={handleAddField} className="space-y-3 pt-2 border-t border-white/5">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Field Name</label>
                <input
                  id="field-name-input"
                  type="text"
                  placeholder="e.g. quantity"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-950 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Data Type</label>
                <select
                  id="field-type-select"
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value as SchemaField['type'])}
                  className="w-full px-3 py-1.5 bg-neutral-950 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-indigo-500 font-mono font-medium"
                >
                  <option value="str">str (String)</option>
                  <option value="int">int (Integer)</option>
                  <option value="float">float (Float)</option>
                  <option value="bool">bool (Boolean)</option>
                  <option value="datetime">datetime (UTC)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <label className="flex items-center gap-1.5 text-xs text-neutral-400 cursor-pointer select-none">
                <input
                  id="field-required-checkbox"
                  type="checkbox"
                  checked={newFieldRequired}
                  onChange={(e) => setNewFieldRequired(e.target.checked)}
                  className="accent-indigo-600 rounded"
                />
                Field is Required
              </label>

              <button
                id="btn-add-field"
                type="submit"
                className="px-3 py-1.5 flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Column
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Code Compiler View */}
        <div className="lg:col-span-7 bg-neutral-900/40 border border-white/5 rounded overflow-hidden h-[410px] flex flex-col justify-between">
          <div>
            {/* Tabs */}
            <div className="bg-neutral-950 px-4 py-2 flex items-center justify-between border-b border-white/5">
              <div className="flex bg-neutral-900/50 p-0.5 rounded border border-white/5">
                <button
                  id="tab-pydantic"
                  onClick={() => setActiveTab('pydantic')}
                  className={`px-3 py-1 rounded text-[10px] font-semibold font-mono transition-all cursor-pointer ${
                    activeTab === 'pydantic' ? 'bg-indigo-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Pydantic v2
                </button>
                <button
                  id="tab-sqlalchemy"
                  onClick={() => setActiveTab('sqlalchemy')}
                  className={`px-3 py-1 rounded text-[10px] font-semibold font-mono transition-all cursor-pointer ${
                    activeTab === 'sqlalchemy' ? 'bg-indigo-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  SQLAlchemy
                </button>
                <button
                  id="tab-routes"
                  onClick={() => setActiveTab('routes')}
                  className={`px-3 py-1 rounded text-[10px] font-semibold font-mono transition-all cursor-pointer ${
                    activeTab === 'routes' ? 'bg-indigo-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  FastAPI Routes
                </button>
              </div>

              {/* Copy Code Button */}
              <button
                id="btn-copy-code"
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-white/5 rounded text-[10px] font-mono transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Panel */}
            <div className="p-4 overflow-y-auto max-h-[300px]">
              <pre className="font-mono text-[11px] text-indigo-300 whitespace-pre overflow-x-auto select-all leading-relaxed">
                {activeTab === 'pydantic' ? pydanticCode : activeTab === 'sqlalchemy' ? sqlalchemyCode : routesCode}
              </pre>
            </div>
          </div>

          {/* Quick info panel */}
          <div className="p-3 bg-neutral-950 border-t border-white/5 flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
            <FileCode className="w-4 h-4 text-indigo-400" />
            <span>Files ready: models/project.py, schemas/project.py, routes/project.py</span>
          </div>
        </div>
      </div>
    </div>
  );
}
