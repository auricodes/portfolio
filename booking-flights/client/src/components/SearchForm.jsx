import { useForm } from "react-hook-form";

function SearchForm({ onSearch, onReset }) {
  const { register, handleSubmit, reset, getValues } = useForm();

  const onSubmit = (data) => {
    const hasAtLeastOneFilter = data.from || data.to || data.date;

    if (!hasAtLeastOneFilter) {
      onReset();
      return;
    }

    onSearch(data);
  };

  const handleResetClick = () => {
    reset();
    onReset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="search-form">
      <div className="form-group">
        <label htmlFor="from">From</label>
        <select id="from" {...register("from")} defaultValue="">
          <option value="">Select departure city</option>
          <option value="Milan">Milan</option>
          <option value="Rome">Rome</option>
          <option value="Naples">Naples</option>
          <option value="Venice">Venice</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="to">To</label>
        <select id="to" {...register("to")} defaultValue="">
          <option value="">Select destination city</option>
          <option value="London">London</option>
          <option value="Paris">Paris</option>
          <option value="Barcelona">Barcelona</option>
          <option value="Berlin">Berlin</option>
          <option value="New York">New York</option>
          <option value="Amsterdam">Amsterdam</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input id="date" type="date" {...register("date")} />
      </div>

      <div className="form-buttons">
        <button type="submit">Search Flights</button>
        <button type="button" onClick={handleResetClick}>
          Reset
        </button>
      </div>
    </form>
  );
}

export default SearchForm;