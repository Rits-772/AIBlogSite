import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, 
  Link as LinkIcon, Undo, Redo, Code 
} from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const buttons = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: 'bold' },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: 'italic' },
    { icon: Code, action: () => editor.chain().focus().toggleCode().run(), active: 'code' },
    { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: { heading: { level: 1 } } },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: { heading: { level: 2 } } },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: 'bulletList' },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: 'orderedList' },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: 'blockquote' },
    { icon: LinkIcon, action: addLink, active: 'link' },
    { icon: Undo, action: () => editor.chain().focus().undo().run(), disabled: !editor.can().undo() },
    { icon: Redo, action: () => editor.chain().focus().redo().run(), disabled: !editor.can().redo() },
  ];

  return (
    <div className="flex flex-wrap gap-1 mb-8 pb-4 border-b border-border/50 sticky top-20 z-10 transition-colors duration-500 bg-transparent">
      {buttons.map((btn, i) => (
        <button
          key={i}
          onClick={btn.action}
          disabled={btn.disabled}
          className={`p-2 rounded-md transition-all duration-300 ${
            btn.active && editor.isActive(btn.active) 
              ? 'text-primary bg-primary/10 shadow-[inset_0_0_0_1px_rgba(var(--primary),0.2)]' 
              : 'text-muted-foreground/60 hover:text-foreground hover:bg-card/50'
          } ${btn.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          <btn.icon className="h-4 w-4" strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
};

const Editor = ({ content, onChange, placeholder = "Begin typing..." }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] font-body text-body-lg leading-relaxed transition-colors duration-500',
      },
    },
  });

  // Sync content if it changes from outside (e.g. AI generation)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="editor-container">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
