/*
import { SVGProps } from 'react' 
type SVG = SVGProps<SVGSVGElement>

type ArrowMaker = (n : string, w : number, h : number, t : string) => SVG;

function min (lhs : number, rhs : number) : number {
   return lhs < rhs ? lhs : rhs;
}

function makeUnownedMembership (n : string, w : number, h : number, t : string) : SVG {
   // Membership unowned, page 26:    -----O
   const r : number = min(w, h) / 4
   return (
      <marker
         id           = {n}
         viewBox      = {`0 0 ${w} ${h}`}
         markerHeight = {h / 2}
         markerWidth  = {w / 2}
         refX         = {h / 2}
         refY         = {w / 2}
      >
         <circle
           r            = {r}
           cx           = {w / 2}
           cy           = {h / 2}
           fill         = "white"
           stroke       = "black"
           stroke-width = "2"
           transform    = {t}
         />
      </marker>);
}

function makeOwnedMembership (n : string, w : number, h : number, t : string) : SVG {
   // Membership owned member, page 26: -------⊕
   const r : number = min(w, h) / 4
   return (
      <marker
         id           = {n}
         viewBox      = {`0 0 ${w} ${h}`}
         markerHeight = {h / 2}
         markerWidth  = {w / 2}
         refX         = {h / 2}
         refY         = {w / 2}
      >
         <circle
           r            = {r}
           cx           = {w / 2}
           cy           = {h / 2}
           fill         = "white"
           stroke       = "black"
           stroke-width = "2"
           transform    = {t}
         />
         <line
            x1           = {w / 2}
            y1           = {h * 1 / 4}
            x2           = {w / 2}
            y2           = {h * 3 / 4}
            stroke       = "black"
            stroke-width = "2"
         />
         <line
            x1           = {w * 1 / 4}
            y1           = {h / 2}
            x2           = {w * 3 / 4}
            y2           = {h / 2}
            stroke       = "black"
            stroke-width = "2"
         />
      </marker>);
}

*/

const Arrows = (
<svg style={{ position: "absolute", top: 0, left: 0 }}>
   <defs>
      // Membership unowned, page 26:    -----O
      <marker
         id           = "Arrow::OwnedMembership"
         viewBox      = "0 0 40 40"
         markerHeight = "20"
         markerWidth  = "20"
         refX         = "20"
         refY         = "20"
      >
         <circle
           r            = "10"
           cx           = "20"
           cy           = "20"
           fill         = "white"
           stroke       = "black"
           stroke-width = "2"
         />
      </marker>

      // Membership owned member, page 26: -------⊕
      <marker
         id           = "Arrow::UnownedMembership"
         viewBox      = "0 0 40 40"
         markerHeight = "20"
         markerWidth  = "20"
         refX         = "20"
         refY         = "20"
      >
         <circle
           r            = "10"
           cx           = "20"
           cy           = "20"
           fill         = "white"
           stroke       = "black"
           stroke-width = "2"
         />
         <line
            x1           = "20"
            y1           = "10"
            x2           = "20"
            y2           = "30"
            stroke       = "black"
            stroke-width = "2"
         />
         <line
            x1           = "10"
            y1           = "20"
            x2           = "30"
            y2           = "20"
            stroke       = "black"
            stroke-width = "2"
         />
      </marker>

      /* Subclassification, page 36: -------▷ */

      <marker
         id           = "Arrow::Subclassification"
         viewBox      = "0 0 40 40"
         markerHeight = {20}
         markerWidth  = {20}
         refX         = {20}
         refY         = {20}
	 orient="auto-start-reverse"
      >
         <polygon
            fill         = "white"
            stroke       = "black"
            stroke-width = "2"
            points       = "
               10,30,
               10,10
               30,20
            "
         />
      </marker>

      /* Part defined, page 36: -------▷ */

      <marker
         id           = "Arrow::PartDefined"
         viewBox      = "0 0 40 40"
         markerHeight = {20}
         markerWidth  = {20}
         refX         = {20}
         refY         = {20}
	 orient="auto-start-reverse"
      >
         <polygon
            fill         = "white"
            stroke       = "black"
            stroke-width = "2"
            points       = "
               10,30,
               10,10
               30,20
            "
         />
         <circle
            cx   = "5"
            cy   = "14"
            r    = "2"
            fill = "black"
         />
         <circle
            cx   = "5"
            cy   = "26"
            r    = "2"
            fill = "black"
         />
      </marker>

      /* Redefinition, page 37: -------▷ */

      <marker
         id           = "Arrow::Redefinition"
         viewBox      = "0 0 40 40"
         markerHeight = {20}
         markerWidth  = {20}
         refX         = {20}
         refY         = {20}
	 orient="auto-start-reverse"
      >
         <polygon
            fill         = "white"
            stroke       = "black"
            stroke-width = "2"
            points       = "
               10,30,
               10,10
               30,20
            "
         />
         <line
            x1   = "4"
            y1   = "8"
            x2   = "4"
            y2   = "32"
            stroke-width = "2"
            stroke       = "black"
            fill = "black"
         />
      </marker>

      /* Part performs, page 66: -------▷ */

      <marker
         id           = "Arrow::PartPerforms"
         viewBox      = "-4 -4 40 40"
         markerHeight = {20}
         markerWidth  = {20}
         refX         = {20}
         refY         = {20}
	 orient="auto-start-reverse"
      >
         <polygon
            fill         = "white"
            stroke       = "black"
            stroke-width = "2"
            points       = "
               10,30,
               10,10
               30,20
            "
         />
         <circle
            cx   = "5"
            cy   = "14"
            r    = "2"
            fill = "black"
         />
         <circle
            cx   = "5"
            cy   = "26"
            r    = "2"
            fill = "black"
         />
         <circle
            cx   = "-2"
            cy   = "14"
            r    = "2"
            fill = "black"
         />
         <circle
            cx   = "-2"
            cy   = "26"
            r    = "2"
            fill = "black"
         />
      </marker>

      /* Composition, page 58: -------▷ */

      <marker
         id           = "Arrow::Composition"
         viewBox      = "0 0 40 40"
         markerHeight = {20}
         markerWidth  = {20}
         refX         = {20}
         refY         = {20}
	 orient="auto-start-reverse"
      >
         <polygon
            fill         = "white"
            stroke       = "black"
            stroke-width = "2"
            points       = "
               5,20,
               20,30
               35,20
               20,10
               5,20,
            "
         />
      </marker>

      /* Aggregation, page 58: -------▷ */

      <marker
         id           = "Arrow::Aggregation"
         viewBox      = "0 0 40 40"
         markerHeight = {20}
         markerWidth  = {20}
         refX         = {20}
         refY         = {20}
	 orient="auto-start-reverse"
      >
         <polygon
            fill         = "black"
            stroke       = "black"
            stroke-width = "2"
            points       = "
               5,20,
               20,30
               35,20
               20,10
               5,20,
            "
         />
      </marker>

      /* Time Slice, page 51: -------▷ */

      <marker
         id           = "Arrow::Aggregation"
         viewBox      = "0 0 40 40"
         markerHeight = {20}
         markerWidth  = {20}
         refX         = {20}
         refY         = {20}
	 orient="auto-start-reverse"
      >
         <polygon
            fill         = "black"
            stroke       = "black"
            stroke-width = "2"
            points       = "
               5,20,
               20,30
               35,20
               20,10
               5,20,
            "
         />
      </marker>
   </defs>
</svg>)

export default Arrows;
