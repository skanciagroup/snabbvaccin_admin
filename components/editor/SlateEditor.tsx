import React, { useCallback, useMemo } from "react";
import {
  createEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  Transforms,
  BaseEditor,
} from "slate";
import {
  Editable,
  withReact,
  Slate,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";

// Types
type CustomElement = {
  type:
    | "paragraph"
    | "block-quote"
    | "bulleted-list"
    | "numbered-list"
    | "heading-one"
    | "heading-two"
    | "list-item";
  children: CustomText[];
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "Start typing..." }],
  },
];

const SlateEditor = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    [],
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    [],
  );

  const toggleBlock = (format: string) => {
    const isActive = isBlockActive(format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        LIST_TYPES.includes(n.type),
      split: true,
    });

    Transforms.setNodes(editor, {
      type: (isActive
        ? "paragraph"
        : isList
        ? "list-item"
        : format) as CustomElement["type"],
    });

    if (!isActive && isList) {
      const block = { type: format as CustomElement["type"], children: [] };
      Transforms.wrapNodes(editor, block);
    }
  };

  const toggleMark = (format: string) => {
    const isActive = isMarkActive(format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const isBlockActive = (format: string) => {
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    });
    return !!match;
  };

  const isMarkActive = (format: string) => {
    const marks = Editor.marks(editor) as Record<string, boolean>;
    return marks ? marks[format] === true : false;
  };

  return (
    <div>
      <div className="flex gap-2" style={{ padding: "10px 0" }}>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark("bold");
          }}
        >
          Bold
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock("heading-one");
          }}
        >
          H1
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock("block-quote");
          }}
        >
          Quote
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock("bulleted-list");
          }}
        >
          List
        </button>
      </div>
      <Slate editor={editor} initialValue={initialValue} onChange={() => {}}>
        <Editable
          renderElement={renderElement}
          className="border border-gray-300 rounded-md p-2 min-h-[200px] editor-container"
          renderLeaf={renderLeaf}
          placeholder="Enter some text..."
          onKeyDown={(event) => {
            if (event.ctrlKey) {
              switch (event.key) {
                case "b": {
                  event.preventDefault();
                  toggleMark("bold");
                  break;
                }
              }
            }
          }}
        />
      </Slate>
    </div>
  );
};

const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  if (leaf.code) children = <code>{children}</code>;
  return <span {...attributes}>{children}</span>;
};

export default SlateEditor;
