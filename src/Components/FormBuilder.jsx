import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const FormBuilder = () => {
  const [formFields, setFormFields] = useState([]);
  const [editingField, setEditingField] = useState(null);

  const addField = (type) => {
    const newField = {
      id: `${Date.now()}`,
      type,
      label: `New ${type}`,
      required: false,
      values: type === "select" || type === "radio" || type === "checkbox" ? ["Option 1", "Option 2"] : [],
    };
    setFormFields([...formFields, newField]);
  };

  const deleteField = (index) => {
    if (window.confirm("Are you sure you want to delete this field?")) {
      setFormFields(formFields.filter((_, i) => i !== index));
      if (editingField && editingField.index === index) {
        setEditingField(null);
      }
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedFields = Array.from(formFields);
    const [movedItem] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, movedItem);
    setFormFields(reorderedFields);
  };

  const updateField = () => {
    if (editingField !== null) {
      const updatedFields = [...formFields];
      updatedFields[editingField.index] = editingField;
      setFormFields(updatedFields);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the form?")) {
      setFormFields([]);
      setEditingField(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen p-4 lg:p-8 bg-gray-100 space-y-4 lg:space-y-0 lg:space-x-8">
      {/* Field panel */}
      <div className="w-full lg:w-1/4 p-6 bg-white rounded-xl shadow-lg border">
        <h2 className="text-2xl font-semibold mb-6 text-blue-600 border-b pb-2">Form Builder</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {["text", "textarea", "select", "checkbox", "radio", "number", "email", "password", "date", "file"].map((type) => (
            <button key={type} onClick={() => addField(type)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
              + {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Live preview panel */}
      <div className="w-full lg:w-1/2 lg:overflow-y-auto lg:max-h-screen">
        <form className="border p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-green-600 border-b pb-2">Live Preview</h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable-formFields">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                  {formFields.length === 0 ? (
                    <p className="text-gray-500 italic">No fields added yet.</p>
                  ) : (
                    formFields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-4 bg-gray-50 rounded-lg shadow flex flex-col lg:flex-row justify-between items-start lg:items-center border"
                          >
                            <div className="flex-1 mb-4 lg:mb-0 lg:mr-6" onClick={() => setEditingField({ ...field, index })}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                              {field.type === "select" ? (
                                <select className="border p-2 w-full rounded-lg shadow-sm">
                                  {field.values.map((option, idx) => (
                                    <option key={idx} value={option}>{option}</option>
                                  ))}
                                </select>
                              ) : field.type === "radio" || field.type === "checkbox" ? (
                                <div className="flex space-x-4">
                                  {field.values.map((option, idx) => (
                                    <label key={idx} className="inline-flex items-center">
                                      <input type={field.type} name={field.id} className="mr-2" />
                                      {option}
                                    </label>
                                  ))}
                                </div>
                              ) : (
                                <input type={field.type} className="border p-2 w-full rounded-lg shadow-sm" required={field.required} />
                              )}
                            </div>
                            <button onClick={() => deleteField(index)} type="button" className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-all">Delete</button>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div className="flex justify-between mt-6">
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">Submit</button>
            <button type="button" onClick={handleReset} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all">Reset</button>
          </div>
        </form>
      </div>
      {editingField && (
        <div className="w-full lg:w-1/4 p-6 bg-white rounded-xl shadow-lg border">
          <h2 className="text-2xl font-semibold mb-6 text-purple-600 border-b pb-2">Field Settings</h2>
          <label className="block mb-2">Label:</label>
          <input type="text" value={editingField.label} onChange={(e) => setEditingField({ ...editingField, label: e.target.value })} className="border p-2 w-full rounded-lg" />
          <div className="mt-4 flex justify-end">
            <button onClick={updateField} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;