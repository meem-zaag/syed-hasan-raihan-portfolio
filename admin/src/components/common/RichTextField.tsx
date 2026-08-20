import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

interface RichTextFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function RichTextField({ value, onChange, placeholder }: RichTextFieldProps) {
  return (
    <ReactQuill
      theme="snow"
      value={value ?? ''}
      onChange={(content) => onChange?.(content)}
      modules={modules}
      placeholder={placeholder}
    />
  );
}
