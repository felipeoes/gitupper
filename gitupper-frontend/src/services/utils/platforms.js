import {
  MdCalendarToday,
  MdCode,
  MdFilterTiltShift,
  MdSearch,
} from "react-icons/md";

import {
  DateFilterView,
  LanguageFilterView,
} from "./../../views/auth/platforms/filterViews/index";

import { paths } from "./../../services/utils/paths";
import { colors } from "./../../styles/colors";
import beecrowdCleanLogo from "./../../assets/images/logos/beecrowd_clean.svg";
import beecrowdLogo from "./../../assets/images/logos/logo_beecrowd.svg";
import hackerrankCleanLogo from "./../../assets/images/logos/hackerrank_clean.svg";
import hackerrankLogo from "./../../assets/images/logos/logo_hackerrank.svg";
import leetcodeLogo from "./../../assets/images/logos/logo_leetcode.png";
import leetcodeCleanLogo from "./../../assets/images/logos/leetcode_clean.png";

export const currentPlatforms = {
  beecrowd: {
    platformPrefix: "bee",

    icon: beecrowdLogo,
    cleanIcon: beecrowdCleanLogo,
    resetPath: paths.beecrowdReset,
    color: colors.beecrowdPrimary,
  },
  hackerrank: {
    platformPrefix: "hacker",
    icon: hackerrankLogo,
    cleanIcon: hackerrankCleanLogo,
    resetPath: paths.hackerrankReset,
    color: colors.hackerrankPrimary,
  },
  leetcode: {
    platformPrefix: "leet",
    icon: leetcodeLogo,
    cleanIcon: leetcodeCleanLogo,
    resetPath: paths.leetcodeReset,
    color: colors.leetcodePrimary,
  },
};

export const submissionsColumns = [
  {
    id: "id",
    numeric: true,
    disablePadding: true,
    label: "# ID",
    align: "center",
    icon: "",
    filter: "",
  },
  {
    id: "problem_name",
    numeric: false,
    disablePadding: false,
    label: "Problema",
    align: "left",
  },
  {
    id: "category",
    numeric: false,
    disablePadding: false,
    label: "Categoria",
    align: "left",
    icon: MdSearch,
  },
  {
    id: "prog_language",
    numeric: false,
    disablePadding: false,
    label: "Linguagem",
    align: "left",
    icon: MdCode,
    FilterView: LanguageFilterView,
    select: true,
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    align: "left",
    icon: MdFilterTiltShift,
  },
  {
    id: "date_submitted",
    numeric: false,
    disablePadding: false,
    label: "Data",
    align: "left",
    icon: MdCalendarToday,
    FilterView: DateFilterView,
  },
  {
    id: "source_code",
    numeric: false,
    disablePadding: true,
    label: "Código-fonte",
    align: "center",
    icon: "",
  },
];

export const platforms_obj = {
  beecrowd: {
    name: "beecrowd",
    color: colors.beecrowdPrimary,
    platformPrefix: "bee",
  },
  hackerrank: {
    name: "hackerrank",
    color: colors.hackerrankPrimary,
    platformPrefix: "hacker",
  },
  leetcode: {
    name: "leetcode",
    color: colors.leetcodePrimary,
    platformPrefix: "leet",
  },
};

export const beecrowdSubmissionColumns = [
  {
    id: "id",
    numeric: true,
    disablePadding: true,
    label: "# ID",
    align: "center",
    icon: "",
    filter: "",
  },
  {
    id: "problem_name",
    numeric: false,
    disablePadding: false,
    label: "Problema",
    align: "left",
  },
  {
    id: "category",
    numeric: false,
    disablePadding: false,
    label: "Categoria",
    align: "left",
    icon: MdSearch,
  },
  {
    id: "prog_language",
    numeric: false,
    disablePadding: false,
    label: "Linguagem",
    align: "left",
    icon: MdCode,
    FilterView: LanguageFilterView,
    select: true,
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    align: "left",
    icon: MdFilterTiltShift,
  },
  {
    id: "date_submitted",
    numeric: false,
    disablePadding: false,
    label: "Data",
    align: "left",
    icon: MdCalendarToday,
    FilterView: DateFilterView,
  },
  {
    id: "source_code",
    numeric: false,
    disablePadding: true,
    label: "Código-fonte",
    align: "center",
    icon: "",
  },
];

export const hackerrankSubmissionColumns = [
  {
    id: "id",
    numeric: true,
    disablePadding: true,
    label: "# ID",
    align: "center",
    icon: "",
    filter: "",
  },
  {
    id: "problem_name",
    numeric: false,
    disablePadding: false,
    label: "Problema",
    align: "left",
  },
  {
    id: "category",
    numeric: false,
    disablePadding: false,
    label: "Categoria",
    align: "left",
    icon: MdSearch,
  },
  {
    id: "prog_language",
    numeric: false,
    disablePadding: false,
    label: "Linguagem",
    align: "left",
    icon: MdCode,
    FilterView: LanguageFilterView,
    select: true,
  },

  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    align: "left",
    icon: MdFilterTiltShift,
  },

  {
    id: "date_submitted",
    numeric: false,
    disablePadding: false,
    label: "Data",
    align: "center",
    icon: MdCalendarToday,
    FilterView: DateFilterView,
  },
  {
    id: "source_code",
    numeric: false,
    disablePadding: false,
    label: "Código-fonte",
    align: "center",
    icon: "",
  },
];
