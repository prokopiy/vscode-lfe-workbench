'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// import { spawn, spawnSync, execFileSync, ChildProcess } from 'child_process';
// import { access } from 'fs';
// import { setFlagsFromString } from 'v8';
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
// import * from child_process
// "use strict";
// import * as vscode from "vscode";
// import { CodeManager } from "./codeManager";
// import * as fs from "fs";
// import * as micromatch from "micromatch";
// import * as os from "os";
// import { basename, dirname, extname, join } from "path";
// import * as vscode from "vscode";
// import { AppInsightsClient } from "./appInsightsClient";
// import { Constants } from "./constants";
// import { Utility } from "./utility";
// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = vscode_languageserver_1.createConnection(vscode_languageserver_1.ProposedFeatures.all);
// const codeManager = new CodeManager();
// Create a simple text document manager. 
let documents = new vscode_languageserver_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;
var core_completitions = [
    { label: 'quote', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'cons', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'car', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'cdr', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'list', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'tuple', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'progn', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'prog1', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'prog2', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'begin', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'tref', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'tset', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'binary', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'map', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'map-get', kind: vscode_languageserver_1.CompletionItemKind.Function },
    // {label:'lambda', kind: CompletionItemKind.Function},
    { label: 'match-lambda', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'function', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'funcall', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'call', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'list*', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'eval-when-compile', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'spawn', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'apply', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'gief', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'match-lambda', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'and', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'or', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'not', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'andalso', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'orelse', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'lc', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'list-comp', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'bc', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'binary-comp', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'match-spec', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'defsyntax', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'syntaxlet', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'defmodule', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'defrecord', kind: vscode_languageserver_1.CompletionItemKind.Function }
];
var support_completitions = [
    { label: 'abs', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'apply', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'atom_to_binary', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'atom_to_list', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'band', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'binary_part', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'binary_to_atom', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'binary_to_existing_atom', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'binary_to_float', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'binary_to_integer', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'binary_to_list', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'binary_to_term', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'bit_size', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'bitstring_to_list', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'bnot', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'bor', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'bsl', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'bsr', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'bxor', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'byte_size', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'ceil', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'check_old_code', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'check_process_code', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'date', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'delete_module', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'demonitor', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'disconnect_node', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'div', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'element', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'erase', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'error', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'exit', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'float', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'float_to_binary', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'float_to_list', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'floor', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'garbage_collect', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'get', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'get_keys', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'group_leader', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'halt', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'hd', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'integer_to_binary', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'integer_to_list', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'iolist_size', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'iolist_to_binary', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'is_alive', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'is_atom', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'is_binary', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'is_bitstring', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'is_boolean', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'is_float', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'is_function', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'is_integer', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'is_list', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'is_map', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'is_map_key', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'is_number', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'is_pid', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'is_port', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'is_process_alive', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'is_record', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'is_reference', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'is_tuple', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'length', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'link', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'list_to_atom', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'list_to_binary', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'list_to_bitstring', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'list_to_existing_atom', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'list_to_float', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'list_to_integer', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'list_to_pid', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'list_to_port', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'list_to_ref', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'list_to_tuple', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'load_module', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'make_ref', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'map_get', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'map_size', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'max', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'min', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'module_loaded', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'monitor', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'monitor_node', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'node', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'nodes', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'now', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'open_port', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'pid_to_list', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'port_close', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'port_command', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'port_connect', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'port_control', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'port_to_list', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'pre_loaded', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'process_flag', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'process_info', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'processes', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'purge_module', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'put', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'ref_to_list', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'register', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'registered', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'rem', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'round', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'self', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'setelement', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'size', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'spawn', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'spawn_link', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'spawn_monitor', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'spawn_opt', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'split_binary', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'statistics', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'term_to_binary', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'throw', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'time', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'tl', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'trunc', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'tuple_size', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'tuple_to_list', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'unlink', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'unregister', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'whereis', kind: vscode_languageserver_1.CompletionItemKind.Function },
    { label: 'xor', kind: vscode_languageserver_1.CompletionItemKind.Function }
];
var lfe_modules = ["alarm_handler", "app", "application", "appup", "array", "asn1ct", "atomics", "auth", "base64", "beam_lib", "binary", "c", "calendar", "cdv", "cerl", "cerl_clauses", "cerl_trees", "code", "common_test", "compile", "config", "counters", "cover", "cprof", "cpu_sup", "crashdump_viewer", "crypto", "crypto_app", "ct", "ct_cover", "ct_ftp", "ct_hooks", "ct_master", "ct_netconfc", "ct_property_test", "ct_rpc", "ct_run", "ct_slave", "ct_snmp", "ct_ssh", "ct_telnet", "ct_testspec", "dbg", "debugger", "dets", "dialyzer", "diameter", "diameter_app", "diameter_codec", "diameter_dict", "diameter_make", "diameter_sctp", "diameter_tcp", "diameter_transport", "diameterc", "dict", "digraph", "digraph_utils", "disk_log", "disksup", "driver_entry", "dyntrace", "edoc", "edoc_doclet", "edoc_extract", "edoc_layout", "edoc_lib", "edoc_run", "ei", "ei_connect", "ei_global", "eldap", "epmd", "epp", "epp_dodger", "eprof", "erl", "erl_anno", "erl_boot_server", "erl_call", "erl_comment_scan", "erl_ddll", "erl_docgen_app", "erl_driver", "erl_epmd", "erl_eval", "erl_expand_records", "erl_id_trans", "erl_internal", "erl_lint", "erl_nif", "erl_parse", "erl_pp", "erl_prettypr", "erl_prim_loader", "erl_recomment", "erl_scan", "erl_syntax", "erl_syntax_lib", "erl_tar", "erl_tidy", "erl_tracer", "erlang", "erlang.el", "erlc", "erlsrv", "erpc", "error_handler", "error_logger", "erts_alloc", "erts_alloc_config", "escript", "et", "et_collector", "et_selector", "et_viewer", "etop", "ets", "eunit", "eunit_surefire", "file", "file_sorter", "filelib", "filename", "fprof", "ftp", "gb_sets", "gb_trees", "gen_event", "gen_fsm", "gen_sctp", "gen_server", "gen_statem", "gen_tcp", "gen_udp", "gl", "global", "global_group", "glu", "heart", "http_uri", "httpc", "httpd", "httpd_custom_api", "httpd_socket", "httpd_util", "i", "igor", "inet", "inet_res", "inets", "init", "instrument", "int", "io", "io_lib", "jinterface", "kernel_app", "lcnt", "leex", "lists", "log_mf_h", "logger", "logger_disk_log_h", "logger_filters", "logger_formatter", "logger_std_h", "make", "maps", "math", "megaco", "megaco_codec_meas", "megaco_codec_mstone1", "megaco_codec_mstone2", "megaco_codec_transform", "megaco_edist_compress", "megaco_encoder", "megaco_flex_scanner", "megaco_tcp", "megaco_transport", "megaco_udp", "megaco_user", "memsup", "merl", "merl_transform", "mnesia", "mnesia_frag_hash", "mnesia_registry", "mod_alias", "mod_auth", "mod_esi", "mod_security", "ms_transform", "msacc", "net", "net_adm", "net_kernel", "nteventlog", "observer", "odbc", "orddict", "ordsets", "os", "os_sup", "persistent_term", "pg", "pg2", "pool", "prettypr", "proc_lib", "proplists", "public_key", "public_key_app", "qlc", "queue", "rand", "random", "rb", "re", "registry", "rel", "release_handler", "reltool", "relup", "rpc", "run_erl", "runtime_tools_app", "sasl_app", "scheduler", "script", "seq_trace", "sets", "shell", "shell_default", "shell_docs", "slave", "snmp", "snmp_community_mib", "snmp_framework_mib", "snmp_generic", "snmp_index", "snmp_notification_mib", "snmp_pdus", "snmp_standard_mib", "snmp_target_mib", "snmp_user_based_sm_mib", "snmp_view_based_acm_mib", "snmpa", "snmpa_conf", "snmpa_discovery_handler", "snmpa_error", "snmpa_error_io", "snmpa_error_logger", "snmpa_error_report", "snmpa_local_db", "snmpa_mib_data", "snmpa_mib_storage", "snmpa_mpd", "snmpa_network_interface", "snmpa_network_interface_filter", "snmpa_notification_delivery_info_receiver", "snmpa_notification_filter", "snmpa_supervisor", "snmpc", "snmpm", "snmpm_conf", "snmpm_mpd", "snmpm_network_interface", "snmpm_network_interface_filter", "snmpm_user", "socket", "sofs", "ssh", "ssh_agent", "ssh_client_channel", "ssh_client_key_api", "ssh_connection", "ssh_file", "ssh_server_channel", "ssh_server_key_api", "ssh_sftp", "ssh_sftpd", "ssl", "ssl_app", "ssl_crl_cache", "ssl_crl_cache_api", "ssl_session_cache_api", "start", "start_erl", "string", "supervisor", "supervisor_bridge", "sys", "system_information", "systools", "tags", "tftp", "timer", "ttb", "typer", "unicode", "unix_telnet", "uri_string", "user", "werl", "win32reg", "wrap_log_reader", "wx", "wx_misc", "wx_object", "wxAcceleratorEntry", "wxAcceleratorTable", "wxActivateEvent", "wxArtProvider", "wxAuiDockArt", "wxAuiManager", "wxAuiManagerEvent", "wxAuiNotebook", "wxAuiNotebookEvent", "wxAuiPaneInfo", "wxAuiSimpleTabArt", "wxAuiTabArt", "wxBitmap", "wxBitmapButton", "wxBitmapDataObject", "wxBoxSizer", "wxBrush", "wxBufferedDC", "wxBufferedPaintDC", "wxButton", "wxCalendarCtrl", "wxCalendarDateAttr", "wxCalendarEvent", "wxCaret", "wxCheckBox", "wxCheckListBox", "wxChildFocusEvent", "wxChoice", "wxChoicebook", "wxClientDC", "wxClipboard", "wxClipboardTextEvent", "wxCloseEvent", "wxColourData", "wxColourDialog", "wxColourPickerCtrl", "wxColourPickerEvent", "wxComboBox", "wxCommandEvent", "wxContextMenuEvent", "wxControl", "wxControlWithItems", "wxCursor", "wxDataObject", "wxDateEvent", "wxDatePickerCtrl", "wxDC", "wxDCOverlay", "wxDialog", "wxDirDialog", "wxDirPickerCtrl", "wxDisplay", "wxDisplayChangedEvent", "wxDropFilesEvent", "wxEraseEvent", "wxEvent", "wxEvtHandler", "wxFileDataObject", "wxFileDialog", "wxFileDirPickerEvent", "wxFilePickerCtrl", "wxFindReplaceData", "wxFindReplaceDialog", "wxFlexGridSizer", "wxFocusEvent", "wxFont", "wxFontData", "wxFontDialog", "wxFontPickerCtrl", "wxFontPickerEvent", "wxFrame", "wxGauge", "wxGBSizerItem", "wxGCDC", "wxGenericDirCtrl", "wxGLCanvas", "wxGraphicsBrush", "wxGraphicsContext", "wxGraphicsFont", "wxGraphicsMatrix", "wxGraphicsObject", "wxGraphicsPath", "wxGraphicsPen", "wxGraphicsRenderer", "wxGrid", "wxGridBagSizer", "wxGridCellAttr", "wxGridCellBoolEditor", "wxGridCellBoolRenderer", "wxGridCellChoiceEditor", "wxGridCellEditor", "wxGridCellFloatEditor", "wxGridCellFloatRenderer", "wxGridCellNumberEditor", "wxGridCellNumberRenderer", "wxGridCellRenderer", "wxGridCellStringRenderer", "wxGridCellTextEditor", "wxGridEvent", "wxGridSizer", "wxHelpEvent", "wxHtmlEasyPrinting", "wxHtmlLinkEvent", "wxHtmlWindow", "wxIcon", "wxIconBundle", "wxIconizeEvent", "wxIdleEvent", "wxImage", "wxImageList", "wxInitDialogEvent", "wxJoystickEvent", "wxKeyEvent", "wxLayoutAlgorithm", "wxListbook", "wxListBox", "wxListCtrl", "wxListEvent", "wxListItem", "wxListItemAttr", "wxListView", "wxLocale", "wxLogNull", "wxMask", "wxMaximizeEvent", "wxMDIChildFrame", "wxMDIClientWindow", "wxMDIParentFrame", "wxMemoryDC", "wxMenu", "wxMenuBar", "wxMenuEvent", "wxMenuItem", "wxMessageDialog", "wxMiniFrame", "wxMirrorDC", "wxMouseCaptureChangedEvent", "wxMouseCaptureLostEvent", "wxMouseEvent", "wxMoveEvent", "wxMultiChoiceDialog", "wxNavigationKeyEvent", "wxNotebook", "wxNotebookEvent", "wxNotifyEvent", "wxOverlay", "wxPageSetupDialog", "wxPageSetupDialogData", "wxPaintDC", "wxPaintEvent", "wxPalette", "wxPaletteChangedEvent", "wxPanel", "wxPasswordEntryDialog", "wxPen", "wxPickerBase", "wxPopupTransientWindow", "wxPopupWindow", "wxPostScriptDC", "wxPreviewCanvas", "wxPreviewControlBar", "wxPreviewFrame", "wxPrintData", "wxPrintDialog", "wxPrintDialogData", "wxPrinter", "wxPrintout", "wxPrintPreview", "wxProgressDialog", "wxQueryNewPaletteEvent", "wxRadioBox", "wxRadioButton", "wxRegion", "wxSashEvent", "wxSashLayoutWindow", "wxSashWindow", "wxScreenDC", "wxScrollBar", "wxScrolledWindow", "wxScrollEvent", "wxScrollWinEvent", "wxSetCursorEvent", "wxShowEvent", "wxSingleChoiceDialog", "wxSizeEvent", "wxSizer", "wxSizerFlags", "wxSizerItem", "wxSlider", "wxSpinButton", "wxSpinCtrl", "wxSpinEvent", "wxSplashScreen", "wxSplitterEvent", "wxSplitterWindow", "wxStaticBitmap", "wxStaticBox", "wxStaticBoxSizer", "wxStaticLine", "wxStaticText", "wxStatusBar", "wxStdDialogButtonSizer", "wxStyledTextCtrl", "wxStyledTextEvent", "wxSysColourChangedEvent", "wxSystemOptions", "wxSystemSettings", "wxTaskBarIcon", "wxTaskBarIconEvent", "wxTextAttr", "wxTextCtrl", "wxTextDataObject", "wxTextEntryDialog", "wxToggleButton", "wxToolBar", "wxToolbook", "wxToolTip", "wxTopLevelWindow", "wxTreebook", "wxTreeCtrl", "wxTreeEvent", "wxUpdateUIEvent", "wxWindow", "wxWindowCreateEvent", "wxWindowDC", "wxWindowDestroyEvent", "wxXmlResource", "xmerl", "xmerl_eventp", "xmerl_sax_parser", "xmerl_scan", "xmerl_xpath", "xmerl_xs", "xmerl_xsd", "xref", "yecc", "zip", "zlib"];
var modules_completitions = new Map();
var modfunc_completitions = new Map();
var current_completitions = new Map();
// The workspace folder this server is operating on
let workspaceFolder;
connection.onInitialize((params) => {
    let capabilities = params.capabilities;
    workspaceFolder = params.rootUri;
    get_modules_completitions();
    // Does the client support the `workspace/configuration` request?
    // If not, we fall back using global settings.
    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
    hasDiagnosticRelatedInformationCapability = !!(capabilities.textDocument &&
        capabilities.textDocument.publishDiagnostics &&
        capabilities.textDocument.publishDiagnostics.relatedInformation);
    const result = {
        capabilities: {
            textDocumentSync: vscode_languageserver_1.TextDocumentSyncKind.Incremental,
            // Tell the client that this server supports code completion.
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: [":"]
            }
        }
    };
    if (hasWorkspaceFolderCapability) {
        result.capabilities.workspace = {
            workspaceFolders: {
                supported: true
            }
        };
    }
    return result;
});
// function sleep(time: any) {
//     var stop = new Date().getTime();
//     while(new Date().getTime() < stop + time) {
//         ;
//     }
// }
function matchAll(s, pattern) {
    var acc = new Array();
    var m_index = s.search(pattern);
    if (m_index >= 0) {
        var m_string = String(s.match(pattern));
        while (m_index >= 0 && m_string != null) {
            acc.push(s.substr(m_index, m_string.length));
            s = s.substring(m_index + m_string.length);
            m_index = s.search(pattern);
            m_string = String(s.match(pattern));
        }
    }
    return acc;
}
function get_lfe_modules() {
    if (lfe_modules.length > 550) {
        // connection.console.log('get_lfe_modules: return lfe_modules');
        return lfe_modules;
    }
    else {
        // connection.console.log('get_lfe_modules: parsing...');
        const cmd = `lfe -eval "(m)"`;
        var s = myExec(cmd);
        s = s.substring(s.search("\n") + 1, s.length);
        let pattern = /^[\S]+/m;
        var result = matchAll(s, pattern);
        // connection.console.log('get_lfe_modules: lfe_modules:\n' + result +"\n");
        for (var i in result) {
            if (lfe_modules.indexOf(result[i]) < 0) {
                lfe_modules.push(result[i]);
            }
        }
        // lfe_modules = lfe_modules.concat(result);
        return lfe_modules;
    }
}
function get_lfe_module_functions(moduleName) {
    // connection.console.log('get_lfe_module_functions: moduleName: ' + moduleName +"");
    const cmd = `lfe -eval "(m '${moduleName})"`;
    var s = myExec(cmd);
    let pattern = /[\S]+\/[\d]+/g;
    // var result = matchAll(s, pattern);
    let result = s.match(pattern);
    // var result : new Array<string>
    // connection.console.log('get_lfe_module_functions: lfe_module_functions:\n' + result +"\n");
    return result;
}
// Возвращет и загружает если не загружено
function get_modules_completitions() {
    if (modules_completitions.has("lfe")) {
        // connection.console.log('get_modules_completitions:  "lfe" in modules_completitions.keys');
        return modules_completitions.get("lfe");
    }
    else {
        var lfe_m = get_lfe_modules();
        // connection.console.log('get_modules_completitions:  lfe_modules=' + lfe_m);
        var completitions = [];
        for (var i in lfe_m) {
            // connection.console.log('get_modules_completitions:  push=' + lfe_m[i]);
            completitions.push({ label: lfe_m[i], kind: vscode_languageserver_1.CompletionItemKind.Module });
        }
        modules_completitions.set("lfe", completitions);
        return completitions;
    }
}
// Возвращет и загружает если не загружено
function get_module_functions_completitions(moduleName) {
    // connection.console.log(`get_lfe_functions_completitions: start for ${moduleName}`);
    var result = [];
    if (modfunc_completitions.has(moduleName)) {
        // connection.console.log(`get_module_functions_completitions:  "${moduleName}" already exists`);
        result = modfunc_completitions.get(moduleName);
    }
    else {
        if (lfe_modules.indexOf(moduleName) >= 0) {
            // connection.console.log(`get_module_functions_completitions:  "${moduleName}" is correct`);
            var r = get_lfe_module_functions(moduleName);
            if ((r === null || r === void 0 ? void 0 : r.length) != null) {
                // connection.console.log(`get_module_functions_completitions: ${r}`);
                for (var j in r) {
                    // result.push(moduleName + ":" + r[j]);
                    result.push({ label: String(r[j]), kind: vscode_languageserver_1.CompletionItemKind.Function });
                }
                ;
                modfunc_completitions.set(moduleName, result);
            }
            ;
        }
        ;
    }
    ;
    return result;
}
function get_functions_completitions_from_text(modname, text) {
    var completitions = [];
    var pattern = /(defun|defmacro|defrecord)+\s+\S+/g;
    // var mod_fun_pattern = new RegExp(wordPattern + "\\:" + wordPattern);
    // let m1 = pattern.exec(text);
    let m1 = text.match(pattern);
    if (m1 != null) {
        // connection.console.log(`get_functions_completitions_from_text: find patterns: ${m1} (total - ${m1.length})`);
        var ll = [];
        for (var i in m1) {
            var splitted = m1[i].split(" ");
            var ff = splitted[splitted.length - 1];
            if (ll.indexOf(ff) < 0) {
                // connection.console.log(`def... ${splitted[0]}`);
                ll.push(ff);
                if (splitted[0] == "defrecord") {
                    completitions.push({ label: "make-" + ff, kind: vscode_languageserver_1.CompletionItemKind.Function });
                    completitions.push({ label: "match-" + ff, kind: vscode_languageserver_1.CompletionItemKind.Function });
                    completitions.push({ label: "is-" + ff, kind: vscode_languageserver_1.CompletionItemKind.Function });
                    completitions.push({ label: "fields-" + ff, kind: vscode_languageserver_1.CompletionItemKind.Function });
                    completitions.push({ label: "update-" + ff, kind: vscode_languageserver_1.CompletionItemKind.Function });
                }
                else {
                    completitions.push({ label: ff, kind: vscode_languageserver_1.CompletionItemKind.Function });
                }
            }
        }
        current_completitions.set(modname, completitions);
        modfunc_completitions.set(modname, completitions);
    }
    // connection.console.log(`result = ${completitions}`);
    return completitions;
}
function myExec(cmd) {
    var r = "";
    try {
        r = require('child_process').execSync(cmd).toString();
    }
    catch { }
    // my_exec_out = r;
    return r;
}
connection.onInitialized(() => {
    connection.console.log('LFE WB language server is running!');
    if (hasConfigurationCapability) {
        // Register for all configuration changes.
        connection.client.register(vscode_languageserver_1.DidChangeConfigurationNotification.type, undefined);
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders(_event => {
            connection.console.log('Workspace folder change event received.');
        });
    }
});
// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings = { maxNumberOfProblems: 1000 };
let globalSettings = defaultSettings;
// Cache the settings of all open documents
let documentSettings = new Map();
connection.onDidChangeConfiguration(change => {
    if (hasConfigurationCapability) {
        // Reset all cached document settings
        documentSettings.clear();
    }
    else {
        globalSettings = ((change.settings.LFELanguageServer || defaultSettings));
    }
    // Revalidate all open text documents
    documents.all().forEach(validateTextDocument);
});
function getDocumentSettings(resource) {
    if (!hasConfigurationCapability) {
        return Promise.resolve(globalSettings);
    }
    let result = documentSettings.get(resource);
    if (!result) {
        result = connection.workspace.getConfiguration({
            scopeUri: resource,
            section: 'LFELanguageServer'
        });
        documentSettings.set(resource, result);
    }
    return result;
}
documents.onDidOpen((event) => {
    // connection.console.log(`[Server(${process.pid}) ${workspaceFolder}] Document opened: ${event.document.uri}`);
    var mn = event.document.uri.match(/[0-9a-zA-Z_\-]+\.lfe$/);
    if (mn != null) {
        // connection.console.log(`Document opened: ${mn[0].split(".")[0]}`);
        get_functions_completitions_from_text(mn[0].split(".")[0], event.document.getText());
    }
});
// Only keep settings for open documents
documents.onDidClose(e => {
    documentSettings.delete(e.document.uri);
});
documents.onDidSave((event) => {
    // connection.console.log(`[Server(${process.pid}) ${workspaceFolder}] Document opened: ${event.document.uri}`);
    var mn = event.document.uri.match(/[0-9a-zA-Z_\-]+\.lfe$/);
    if (mn != null) {
        // connection.console.log(`Document opened: ${mn[0].split(".")[0]}`);
        get_functions_completitions_from_text(mn[0].split(".")[0], event.document.getText());
    }
});
// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
    let textDocument = change.document;
    let text = textDocument.getText();
    // connection.console.log(`[Server(${process.pid}) ${workspaceFolder}] Document changed: ${change.document.uri}`);
    var mn = change.document.uri.match(/[0-9a-zA-Z_\-]+\.lfe$/);
    if (mn != null) {
        // connection.console.log(`Document opened: ${mn[0].split(".")[0]}`);
        get_functions_completitions_from_text(mn[0].split(".")[0], text);
    }
    // current editor
    // const editor = vscode.window.activeTextEditor;
    // check if there is no selection
    // if (editor != undefined) {
    // the Position object gives you the line and character where the cursor is
    //   const position = editor. selection.active;
    // }
    // let start =  textDocument.positionAt(m.index);
    // let end: textDocument.positionAt(m.index + m[0].length)
    // validateTextDocument(change.document);
});
async function validateTextDocument(textDocument) {
    // In this simple example we get the settings for every validate run.
    let settings = await getDocumentSettings(textDocument.uri);
    // The validator creates diagnostics for all uppercase words length 2 and more
    let text = textDocument.getText();
    let pattern = /\b[A-Z]{32,}\b/g;
    let m;
    let problems = 0;
    let diagnostics = [];
    while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
        problems++;
        let diagnostic = {
            severity: vscode_languageserver_1.DiagnosticSeverity.Warning,
            range: {
                start: textDocument.positionAt(m.index),
                end: textDocument.positionAt(m.index + m[0].length)
            },
            message: `${m[0]} is all uppercase.`,
            source: 'ex'
        };
        if (hasDiagnosticRelatedInformationCapability) {
            diagnostic.relatedInformation = [
                {
                    location: {
                        uri: textDocument.uri,
                        range: Object.assign({}, diagnostic.range)
                    },
                    message: 'Spelling matters'
                },
                {
                    location: {
                        uri: textDocument.uri,
                        range: Object.assign({}, diagnostic.range)
                    },
                    message: 'Particularly for names'
                }
            ];
        }
        diagnostics.push(diagnostic);
    }
    // Send the computed diagnostics to VSCode.
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}
connection.onDidChangeWatchedFiles(_change => {
    // Monitored files have change in VSCode
    connection.console.log('We received an file change event');
});
connection.onDidChangeTextDocument((params) => {
    // The content of a text document did change in VSCode.
    // params.uri uniquely identifies the document.
    // params.contentChanges describe the content changes to the document.
    connection.console.log(`${params.textDocument.uri} changed: ${JSON.stringify(params.contentChanges)}`);
});
// This handler provides the initial list of the completion items.
connection.onCompletion(
// (_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
(_completionParams) => {
    // The pass parameter contains the position of the text document in
    // which code complete got requested. For the example we ignore this
    // info and always provide the same completion items.
    // if (_completionParams != undefined){
    // 	switch (_completionParams.context?.triggerCharacter) {
    // 		case ':':{
    // 			connection.console.log(`onCompletion: triggerCharacter`);
    // 			return [];}; // contains "@INCLUDE" e.g.
    // 		// case '#':
    // 		// 	return codecompletionlist.constants; // contains "#BLACK" e.g.
    // 		default:
    // 			break;
    // 	};
    // };
    connection.console.log(`${_completionParams.position.character}`);
    let textDocument = documents.get(_completionParams.textDocument.uri);
    var mn = _completionParams.textDocument.uri.match(/[0-9a-zA-Z_\-]+\.lfe$/);
    var result_completitions = [];
    if (textDocument != undefined) {
        let text = textDocument.getText();
        var end = textDocument.offsetAt(_completionParams.position);
        var start = end - _completionParams.position.character;
        var ttt = text.substring(start, end);
        // connection.console.log(`onCompletion: parsing line:${ttt}`);
        var wordPattern = "([^\\(\\)\\[\\]\\{\\}\\#\\|\\\\\\,\\'\\`\\;\\:\\s]+[^\\(\\)\\[\\]\\{\\}\\;\\:\\s]*)|([^\\(\\)\\[\\]\\{\\}\\#\\\\\\,\\'\\`\\;\\:\\s]+([\\\\\\|]*[^\\(\\)\\[\\]\\{\\}\\;\\:]*)+\\|)";
        var mod_fun_pattern = /[0-9a-zA-Z_]+[0-9a-zA-Z_\-\=\!\@\#\$\%\^\&\;\?]*\:[0-9a-zA-Z_\-]*$/;
        let m1 = mod_fun_pattern.exec(ttt);
        if (m1 != null) {
            // Если ссылается на модуль, то выдать только функции модуля на который ссылается
            var colon_pos = m1[0].indexOf(":");
            var mod_name = m1[0].substring(0, colon_pos);
            result_completitions = get_module_functions_completitions(mod_name);
        }
        else {
            // Если не ссылается на модуль, то выдать стандартные поддерживаемые формы текущего файла
            result_completitions = core_completitions;
            result_completitions = result_completitions.concat(support_completitions);
            result_completitions = result_completitions.concat(get_modules_completitions());
            if (mn != null) {
                result_completitions = result_completitions.concat(current_completitions.get(mn[0].split(".")[0]));
            }
        }
    }
    return result_completitions;
});
// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item) => {
    if (item.data === 1) {
        // item.detail = 'TypeScript details';
        // item.documentation = 'TypeScript documentation';
    }
    else if (item.kind === vscode_languageserver_1.CompletionItemKind.Function) {
        // item.detail = 'Function details';
        // item.documentation = 'Function documentation ...';
    }
    return item;
});
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// Listen on the connection
connection.listen();
//# sourceMappingURL=server.js.map