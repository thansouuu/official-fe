/* eslint-disable react/display-name */
import { forwardRef } from 'react';
import { Controller } from 'react-hook-form';

const InputField = forwardRef(({ name, as, htmlType, label, control, placeholder, readOnly, disabled, style,labelClassName, ...order }, ref) => {
    const Component = as || 'input';

    return (
        <Controller
            render={({ field: { ref: controllerRef, ...otherFields } }) => (
                <label
                    className={labelClassName}
                >
                    <span className="text-gray-800">{label}:</span>
                    <Component
                        {...otherFields}
                        ref={(node) => {
                            controllerRef(node);

                            if (ref) {
                                ref.current = node;
                            }
                        }}
                        className="mt-1 block w-full rounded-md bg-white border-gray-400 focus:border-gray-500 focus:ring-0 text-black placeholder:text-gray-400 resize-none"
                        rows="3"
                        placeholder={placeholder}
                        type={htmlType}
                        readOnly={readOnly}
                        disabled={disabled}
                        style={style}
                        {...order}
                    />
                </label>
            )}
            control={control}
            name={name}
        />
    );
});

export default InputField;