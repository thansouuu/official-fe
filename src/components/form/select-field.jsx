/* eslint-disable react/display-name */
import { forwardRef } from 'react';
import { Controller } from 'react-hook-form';

const SelectField = forwardRef(({ name, label, control, options }, ref) => {
    return (
        <Controller
            render={({ field: { ref: controllerRef, ...otherFields }, formState: { errors } }) => (
                <label className="block">
                    <span className="text-gray-800">{label}:</span>
                    <select
                        {...otherFields}
                        ref={(node) => {
                            controllerRef(node);

                            if (ref) {
                                ref.current = node;
                            }
                        }}
                        className="block w-full mt-1 rounded-md bg-white border-gray-400 focus:border-gray-500 focus:ring-0 text-black placeholder:text-gray-400 resize-none"
                    >
                        {options.map(({ label }, index) => (
                            <option key={index}>{label}</option>
                        ))}
                    </select>

                    {errors && errors?.[name] && <span className='text-red-600 text-sm inline-block'>{errors[name].message}</span>}
                </label>
            )}
            control={control}
            name={name}
            rules={{
                required: 'Vui lòng chọn món ăn để bình luận',
            }}
        />
    );
});

export default SelectField;
