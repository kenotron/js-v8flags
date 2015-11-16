// this entire module is depressing. i should have spent my time learning
// how to patch v8 so that these options would just be available on the
// process object.

const os = require('os');
const fs = require('fs');
const path = require('path');
const execFile = require('child_process').execFile;
const env = process.env;
const user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME;
const configfile = '.v8flags.'+process.versions.v8+'.'+user+'.json';
const exclusions = ['--help'];

const failureMessage = [
  'Unable to cache a config file for v8flags to a your home directory',
  'or a temporary folder. To fix this problem, please correct your',
  'environment by setting HOME=/path/to/home or TEMP=/path/to/temp.',
  'NOTE: the user running this must be able to access provided path.',
  'If all else fails, please open an issue here:',
  'http://github.com/tkellen/js-v8flags'
].join('\n');

function fail (err) {
  err.message += '\n\n' + failureMessage;
  return err;
}

function openConfig (cb) {
  var userHome = require('user-home');
  var configpath = path.join(userHome || os.tmpdir(), configfile);
  var content;
  try {
    // if the config file is valid, it should be json and therefore
    // node should be able to require it directly. if this doesn't
    // throw, we're done!
    content = require(configpath);
    process.nextTick(function () {
      cb(null, content);
    });
  } catch (e) {
    // if requiring the config file failed, maybe it doesn't exist, or
    // perhaps it has become corrupted. instead of calling back with the
    // content of the file, call back with a file descriptor that we can
    // write the cached data to
    fs.open(configpath, 'w+', function (err, fd) {
      if (err) {
        return cb(err);
      }
      return cb(null, fd);
    });
  }
}

// Skipping all the execFile mumbo-jumbo and head straight for the LTS (Node 4.2.1) flags
function getFlags (cb) {
  return cb(null, [
    "--use_strict",
    "--use_strong",
    "--strong_mode",
    "--strong_this",
    "--es_staging",
    "--harmony",
    "--harmony_shipping",
    "--legacy_const",
    "--harmony_modules",
    "--harmony_array_includes",
    "--harmony_regexps",
    "--harmony_proxies",
    "--harmony_sloppy",
    "--harmony_unicode_regexps",
    "--harmony_reflect",
    "--harmony_destructuring",
    "--harmony_sharedarraybuffer",
    "--harmony_atomics",
    "--harmony_new_target",
    "--harmony_tostring",
    "--harmony_concat_spreadable",
    "--harmony_rest_parameters",
    "--harmony_spreadcalls",
    "--harmony_spread_arrays",
    "--harmony_arrow_functions",
    "--harmony_computed_property_names",
    "--harmony_unicode",
    "--harmony_object",
    "--compiled_keyed_generic_loads",
    "--pretenuring_call_new",
    "--allocation_site_pretenuring",
    "--trace_pretenuring",
    "--trace_pretenuring_statistics",
    "--track_fields",
    "--track_double_fields",
    "--track_heap_object_fields",
    "--track_computed_fields",
    "--track_field_types",
    "--smi_binop",
    "--optimize_for_size",
    "--unbox_double_arrays",
    "--string_slices",
    "--crankshaft",
    "--hydrogen_filter",
    "--use_gvn",
    "--gvn_iterations",
    "--use_canonicalizing",
    "--use_inlining",
    "--use_escape_analysis",
    "--use_allocation_folding",
    "--use_local_allocation_folding",
    "--use_write_barrier_elimination",
    "--max_inlining_levels",
    "--max_inlined_source_size",
    "--max_inlined_nodes",
    "--max_inlined_nodes_cumulative",
    "--loop_invariant_code_motion",
    "--fast_math",
    "--collect_megamorphic_maps_from_stub_cache",
    "--hydrogen_stats",
    "--trace_check_elimination",
    "--trace_environment_liveness",
    "--trace_hydrogen",
    "--trace_hydrogen_filter",
    "--trace_hydrogen_stubs",
    "--trace_hydrogen_file",
    "--trace_phase",
    "--trace_inlining",
    "--trace_load_elimination",
    "--trace_store_elimination",
    "--trace_alloc",
    "--trace_all_uses",
    "--trace_range",
    "--trace_gvn",
    "--trace_representation",
    "--trace_removable_simulates",
    "--trace_escape_analysis",
    "--trace_allocation_folding",
    "--trace_track_allocation_sites",
    "--trace_migration",
    "--trace_generalization",
    "--stress_pointer_maps",
    "--stress_environments",
    "--deopt_every_n_times",
    "--deopt_every_n_garbage_collections",
    "--print_deopt_stress",
    "--trap_on_deopt",
    "--trap_on_stub_deopt",
    "--deoptimize_uncommon_cases",
    "--polymorphic_inlining",
    "--use_osr",
    "--array_bounds_checks_elimination",
    "--trace_bce",
    "--array_bounds_checks_hoisting",
    "--array_index_dehoisting",
    "--analyze_environment_liveness",
    "--load_elimination",
    "--check_elimination",
    "--store_elimination",
    "--dead_code_elimination",
    "--fold_constants",
    "--trace_dead_code_elimination",
    "--unreachable_code_elimination",
    "--trace_osr",
    "--stress_runs",
    "--lookup_sample_by_shared",
    "--cache_optimized_code",
    "--flush_optimized_code_cache",
    "--inline_construct",
    "--inline_arguments",
    "--inline_accessors",
    "--escape_analysis_iterations",
    "--optimize_for_in",
    "--concurrent_recompilation",
    "--trace_concurrent_recompilation",
    "--concurrent_recompilation_queue_length",
    "--concurrent_recompilation_delay",
    "--block_concurrent_recompilation",
    "--concurrent_osr",
    "--omit_map_checks_for_leaf_maps",
    "--turbo",
    "--turbo_shipping",
    "--turbo_greedy_regalloc",
    "--turbo_filter",
    "--trace_turbo",
    "--trace_turbo_graph",
    "--trace_turbo_cfg_file",
    "--trace_turbo_types",
    "--trace_turbo_scheduler",
    "--trace_turbo_reduction",
    "--trace_turbo_jt",
    "--trace_turbo_ceq",
    "--turbo_asm",
    "--turbo_asm_deoptimization",
    "--turbo_verify",
    "--turbo_stats",
    "--turbo_splitting",
    "--turbo_types",
    "--turbo_type_feedback",
    "--turbo_allocate",
    "--turbo_source_positions",
    "--context_specialization",
    "--turbo_inlining",
    "--trace_turbo_inlining",
    "--loop_assignment_analysis",
    "--turbo_profiling",
    "--turbo_verify_allocation",
    "--turbo_move_optimization",
    "--turbo_jt",
    "--turbo_osr",
    "--turbo_try_catch",
    "--turbo_try_finally",
    "--turbo_stress_loop_peeling",
    "--turbo_cf_optimization",
    "--turbo_frame_elision",
    "--turbo_cache_shared_code",
    "--typed_array_max_size_in_heap",
    "--frame_count",
    "--interrupt_budget",
    "--type_info_threshold",
    "--generic_ic_threshold",
    "--self_opt_count",
    "--trace_opt_verbose",
    "--debug_code",
    "--code_comments",
    "--enable_sse3",
    "--enable_sse4_1",
    "--enable_sahf",
    "--enable_avx",
    "--enable_fma3",
    "--enable_bmi1",
    "--enable_bmi2",
    "--enable_lzcnt",
    "--enable_popcnt",
    "--enable_vfp3",
    "--enable_armv7",
    "--enable_armv8",
    "--enable_neon",
    "--enable_sudiv",
    "--enable_mls",
    "--enable_movw_movt",
    "--enable_unaligned_accesses",
    "--enable_32dregs",
    "--enable_vldr_imm",
    "--force_long_branches",
    "--mcpu",
    "--expose_natives_as",
    "--expose_debug_as",
    "--expose_free_buffer",
    "--expose_gc",
    "--expose_gc_as",
    "--expose_externalize_string",
    "--expose_trigger_failure",
    "--stack_trace_limit",
    "--builtins_in_stack_traces",
    "--disable_native_files",
    "--inline_new",
    "--trace_codegen",
    "--trace",
    "--mask_constants_with_cookie",
    "--lazy",
    "--trace_opt",
    "--trace_opt_stats",
    "--opt",
    "--always_opt",
    "--always_osr",
    "--prepare_always_opt",
    "--trace_deopt",
    "--trace_stub_failures",
    "--serialize_toplevel",
    "--serialize_inner",
    "--trace_serializer",
    "--min_preparse_length",
    "--max_opt_count",
    "--compilation_cache",
    "--cache_prototype_transitions",
    "--cpu_profiler_sampling_interval",
    "--trace_debug_json",
    "--trace_js_array_abuse",
    "--trace_external_array_abuse",
    "--trace_array_abuse",
    "--enable_liveedit",
    "--hard_abort",
    "--stack_size",
    "--max_stack_trace_source_length",
    "--always_inline_smi_code",
    "--min_semi_space_size",
    "--target_semi_space_size",
    "--max_semi_space_size",
    "--semi_space_growth_factor",
    "--experimental_new_space_growth_heuristic",
    "--max_old_space_size",
    "--initial_old_space_size",
    "--max_executable_size",
    "--gc_global",
    "--gc_interval",
    "--retain_maps_for_n_gc",
    "--trace_gc",
    "--trace_gc_nvp",
    "--trace_gc_ignore_scavenger",
    "--trace_idle_notification",
    "--trace_idle_notification_verbose",
    "--print_cumulative_gc_stat",
    "--print_max_heap_committed",
    "--trace_gc_verbose",
    "--trace_allocation_stack_interval",
    "--trace_fragmentation",
    "--trace_fragmentation_verbose",
    "--trace_mutator_utilization",
    "--weak_embedded_maps_in_optimized_code",
    "--weak_embedded_objects_in_optimized_code",
    "--flush_code",
    "--trace_code_flushing",
    "--age_code",
    "--incremental_marking",
    "--incremental_marking_steps",
    "--overapproximate_weak_closure",
    "--min_progress_during_object_groups_marking",
    "--max_object_groups_marking_rounds",
    "--concurrent_sweeping",
    "--trace_incremental_marking",
    "--track_gc_object_stats",
    "--trace_gc_object_stats",
    "--track_detached_contexts",
    "--trace_detached_contexts",
    "--histogram_interval",
    "--heap_profiler_trace_objects",
    "--use_idle_notification",
    "--use_ic",
    "--trace_ic",
    "--vector_stores",
    "--native_code_counters",
    "--always_compact",
    "--never_compact",
    "--compact_code_space",
    "--cleanup_code_caches_at_gc",
    "--use_marking_progress_bar",
    "--zap_code_space",
    "--random_seed",
    "--trace_weak_arrays",
    "--track_prototype_users",
    "--trace_prototype_users",
    "--eliminate_prototype_chain_checks",
    "--use_verbose_printer",
    "--allow_natives_syntax",
    "--trace_parse",
    "--trace_sim",
    "--debug_sim",
    "--check_icache",
    "--stop_sim_at",
    "--sim_stack_alignment",
    "--sim_stack_size",
    "--log_regs_modified",
    "--log_colour",
    "--ignore_asm_unimplemented_break",
    "--trace_sim_messages",
    "--stack_trace_on_illegal",
    "--abort_on_uncaught_exception",
    "--randomize_hashes",
    "--hash_seed",
    "--profile_deserialization",
    "--serialization_statistics",
    "--regexp_optimization",
    "--testing_bool_flag",
    "--testing_maybe_bool_flag",
    "--testing_int_flag",
    "--testing_float_flag",
    "--testing_string_flag",
    "--testing_prng_seed",
    "--testing_serialization_file",
    "--startup_blob",
    "--profile_hydrogen_code_stub_compilation",
    "--predictable",
    "--force_marking_deque_overflows",
    "--stress_compaction",
    "--manual_evacuation_candidates_selection",
    "--dump_counters",
    "--debugger",
    "--map_counters",
    "--js_arguments",
    "--log",
    "--log_all",
    "--log_api",
    "--log_code",
    "--log_gc",
    "--log_handles",
    "--log_snapshot_positions",
    "--log_suspect",
    "--prof",
    "--prof_cpp",
    "--prof_browser_mode",
    "--log_regexp",
    "--logfile",
    "--logfile_per_isolate",
    "--ll_prof",
    "--perf_basic_prof",
    "--gc_fake_mmap",
    "--log_internal_timer_events",
    "--log_timer_events",
    "--log_instruction_stats",
    "--log_instruction_file",
    "--log_instruction_period",
    "--redirect_code_traces",
    "--redirect_code_traces_to",
    "--hydrogen_track_positions",
    "--trace_elements_transitions",
    "--trace_creation_allocation_sites",
    "--print_code_stubs",
    "--test_secondary_stub_cache",
    "--test_primary_stub_cache",
    "--print_code",
    "--print_opt_code",
    "--print_unopt_code",
    "--print_code_verbose",
    "--print_builtin_code",
    "--sodium",
    "--print_all_code"
  ]);
}

// write some json to a file descriptor. if this fails, call back
// with both the error and the data that was meant to be written.
function writeConfig (fd, flags, cb) {
  var buf = new Buffer(JSON.stringify(flags));
  return fs.write(fd, buf, 0, buf.length, 0 , function (writeErr) {
    fs.close(fd, function (closeErr) {
      var err = writeErr || closeErr;
      if (err) {
        return cb(fail(err), flags);
      }
      return cb(null, flags);
    });
  });
}

module.exports = function (cb) {
  // bail early if this is not node
  var isElectron = process.versions && process.versions.electron;
  if (isElectron) {
    return process.nextTick(function () {
      cb(null, []);
    });
  }

  // attempt to open/read cache file
  openConfig(function (openErr, result) {
    if (!openErr && typeof result !== 'number') {
      return cb(null, result);
    }
    // if the result is not an array, we need to go fetch
    // the flags by invoking node with `--v8-options`
    getFlags(function (flagsErr, flags) {
      // if there was an error fetching the flags, bail immediately
      if (flagsErr) {
        return cb(flagsErr);
      }
      // if there was a problem opening the config file for writing
      // throw an error but include the flags anyway so that users
      // can continue to execute (at the expense of having to fetch
      // flags on every run until they fix the underyling problem).
      if (openErr) {
        return cb(fail(openErr), flags);
      }
      // write the config file to disk so subsequent runs can read
      // flags out of a cache file.
      return writeConfig(result, flags, cb);
    });
  });
};

module.exports.configfile = configfile;
