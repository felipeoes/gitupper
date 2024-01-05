import re
import json

SUBMISSIONS_DIR = "media/files/submissions"

platforms = {
    "bee": {
        "name": "beecrowd",
        "submissions_dir": f"{SUBMISSIONS_DIR}/beecrowd",
    },
    "hacker": {
        "name": "hackerrank",
        "submissions_dir": f"{SUBMISSIONS_DIR}/hackerrank",
    },
    "leet": {
        "name": "leetcode",
        "submissions_dir": f"{SUBMISSIONS_DIR}/leetcode",
    },
}

prog_lang_map = {
    "python": ".py",
    "c": ".c",
    "java": ".java",
    "c++": ".cpp",
    "c#": ".cs",
    "javascript": ".js",
    "ruby": ".rb",
    "php": ".php",
    "perl": ".pl",
    "haskell": ".hs",
    "scala": ".scala",
    "go": ".go",
    "swift": ".swift",
    "objective-c": ".m",
    "matlab": ".m",
    "r": ".r",
    "lua": ".lua",
    "clojure": ".clj",
    "erlang": ".erl",
    "ocaml": ".ml",
    "fsharp": ".fs",
    "prolog": ".pl",
    "octave": ".m",
    "rust": ".rs",
    "d": ".d",
    "kotlin": ".kt",
    "ada": ".adb",
    "fortran": ".f",
    "vb": ".vb",
    "vhdl": ".vhd",
    "verilog": ".v",
    "tex": ".tex",
    "dart": ".dart",
}


def format_string(string: str, regex_pattern: str, is_problem_name=False):
    return re.sub(regex_pattern, '', string) if not is_problem_name else string.replace(" ", "_")


def format_problem_name(problem_name: str):
    return format_string(problem_name, regex_pattern='[^a-zA-Z.\d\s]', is_problem_name=True)


def format_prog_language(prog_language: str):
    return "".join(filter(lambda string: not string.isdigit(
    ), prog_language.split(" ")[0].lower()))


def format_filename(problem_number: str, problem_name: str, prog_language: str):
    filename = "{}_{}{}".format(
        problem_number, problem_name, ".sql" if prog_language.endswith("sql") else prog_lang_map[prog_language])

    return filename


def format_submission(submission, platform_prefix: str):
    if platform_prefix == "bee":
        submission_obj = {
            "id": submission.id,
            "problem_number": submission.problem_number,
            "problem_name": submission.problem_name,
            "status": submission.status,
            "prog_language": submission.prog_language,
            "category": submission.category,
            "date_submitted": submission.date_submitted.strftime('%d/%m/%Y'),
            "source_code": submission.source_code,
            "filename": submission.filename,
        }
    elif platform_prefix == "hacker":
        submission_obj = {
            "id": submission.id,
            "challenge_id": submission.challenge_id,
            "contest_id": submission.contest_id,
            "problem_name": submission.problem_name,
            "status": submission.status,
            "prog_language": submission.prog_language,
            "category": submission.category,
            "date_submitted": str(submission.date_submitted),
            "source_code": submission.source_code,
            "display_score": submission.display_score,
            "filename": submission.filename,
        }

    elif platform_prefix == "leet":
        submission_obj = {
            "id": submission.id,
            "problem_name": submission.problem_name,
            "problem_number": submission.problem_number,
            "status": submission.status,
            "prog_language": submission.prog_language,
            "category": submission.category,
            "date_submitted": str(submission.date_submitted),
            "source_code": submission.source_code,
            "filename": submission.filename,
        }

    return submission_obj


def response_json_parser(response):
    try:
        return json.loads(response.text)
    except:
        return None
