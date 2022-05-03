import * as fs from 'fs-extra';

/**
 * Location information for a single pipeline invocation in the RA.
 */
export interface PipelineInfo {
  startLine: number;
  raStartLine: number;
  raEndLine: number;
}

/**
 * Location information for a single predicate in the RA.
 */
export interface PredicateSymbol {
  /**
   * `PipelineInfo` for each iteration. A non-recursive predicate will have a single iteration `0`.
   */
  iterations: Record<number, PipelineInfo>;
}

/**
 * Location information for the RA from an evaluation log. Line numbers point into the
 * human-readable log summary.
 */
export interface SummarySymbols {
  predicates: Record<string, PredicateSymbol>;
}

// Tuple counts for Expr::Expr::getParent#dispred#f0820431#ff@76d6745o:
const NON_RECURSIVE_TUPLE_COUNT_REGEXP = /^Tuple counts for (?<predicateName>\S+):$/;
// Tuple counts for Expr::Expr::getEnclosingStmt#f0820431#bf@923ddwj9 on iteration 0 running pipeline base:
const RECURSIVE_TUPLE_COUNT_REGEXP = /^Tuple counts for (?<predicateName>\S+) on iteration (?<iteration>\d+) /;
const RETURN_REGEXP = /^\s*return /;

/**
 * Parse a human-readable evaluation log summary to find the location of the RA for each pipeline
 * run.
 *
 * TODO: Once we're more certain about the symbol format, we should have the CLI generate this as it
 * generates the human-readabe summary to avoid having to rely on regular expression matching of the
 * human-readable text.
 *
 * @param fileLocation The path to the summary file.
 * @returns Symbol information for the summary file.
 */
export async function generateSummarySymbols(fileLocation: string): Promise<SummarySymbols> {
  const summary = await fs.promises.readFile(fileLocation, { encoding: 'utf-8' });
  const symbols: SummarySymbols = {
    predicates: {}
  };

  const lines = summary.split(/\r?\n/);
  var lineNumber = 0;
  while (lineNumber < lines.length) {
    const startLineNumber = lineNumber;
    lineNumber++;
    const startLine = lines[startLineNumber];
    const nonRecursiveMatch = startLine.match(NON_RECURSIVE_TUPLE_COUNT_REGEXP);
    var predicateName: string | undefined = undefined;
    var iteration: number = 0;
    if (nonRecursiveMatch) {
      predicateName = nonRecursiveMatch.groups!.predicateName;
    } else {
      const recursiveMatch = startLine.match(RECURSIVE_TUPLE_COUNT_REGEXP);
      if (recursiveMatch) {
        predicateName = recursiveMatch.groups!.predicateName;
        iteration = parseInt(recursiveMatch.groups!.iteration);
      }
    }

    if (predicateName !== undefined) {
      const raStartLine = lineNumber;
      var raEndLine: number | undefined = undefined;
      while ((lineNumber < lines.length) && (raEndLine === undefined)) {
        const raLine = lines[lineNumber];
        const returnMatch = raLine.match(RETURN_REGEXP);
        if (returnMatch) {
          raEndLine = lineNumber;
        }
        lineNumber++;
      }
      if (raEndLine === undefined) {
        raEndLine = lineNumber - 1;
      }
      var symbol = symbols.predicates[predicateName];
      if (symbol === undefined) {
        symbol = {
          iterations: {}
        };
        symbols.predicates[predicateName] = symbol;
      }
      symbol.iterations[iteration] = {
        startLine: lineNumber,
        raStartLine: raStartLine,
        raEndLine: raEndLine
      };
    }
  }

  return symbols;
}
