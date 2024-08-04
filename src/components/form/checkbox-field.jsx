/* eslint-disable react/display-name */
import { forwardRef } from 'react';
import { Controller } from 'react-hook-form';

const CheckboxField = forwardRef(({ name, label, control }, ref) => {
    return (
        <Controller
            render={({ field: { ref: controllerRef, ...otherFields } }) => (
                <label className="inline-flex items-center">
                    <input
                        {...otherFields}
                        ref={(node) => {
                            controllerRef(node);

                            if (ref) {
                                ref.current = node;
                            }
                        }}
                        type="checkbox"
                        className="rounded bg-black/40 border-transparent focus:border-transparent focus:bg-gray-200 text-white focus:ring-1 focus:ring-offset-2 focus:ring-gray-500"
                    />
                    <span className="ml-2">{label}</span>
                </label>
            )}
            control={control}
            name={name}
        />
    );
});

export default CheckboxField;
